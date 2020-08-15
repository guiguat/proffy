import { Request, Response, NextFunction } from "express";

import convertHourToMinutes from "../utils/convertHourToMinutes";
import db from "../database/connection";

interface IScheduleItem {
  weekday: number;
  from: string;
  to: string;
}

export default class ClassesController {
  static async index(request: Request, response: Response, next: NextFunction) {
    const filters = request.query;

    const subject = filters.subject as string;
    const weekday = filters.weekday as string;
    const time = filters.time as string;

    if (!filters.weekday || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: "Missing filters to search classes",
      });
    }

    const timeInMinutes = convertHourToMinutes(time);

    try {
      const classes = await db("classes")
        .whereExists(function () {
          this.select("class_schedule.*")
            .from("class_schedule")
            .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
            .whereRaw("`class_schedule`.`weekday` = ??", Number(weekday))
            .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes])
            .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes]);
        })
        .where("classes.subject", "=", subject)
        .join("professor", "classes.prof_id", "=", "professor.id")
        .select(["classes.*", "professor.*"]);

      return response.json(classes);
    } catch (error) {
      next(error);
    }
  }

  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const {
      uid,
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule,
    } = request.body;

    const trx = await db.transaction();

    try {
      const insertedProfessorsIds = await trx("professor").insert({
        name,
        avatar,
        whatsapp,
        bio,
        user_id: uid,
      });

      const prof_id = insertedProfessorsIds[0];

      const insertedClassesIds = await trx("classes").insert({
        subject,
        cost,
        prof_id,
      });

      const class_id = insertedClassesIds[0];

      const classSchedule = schedule.map((scheduleItem: IScheduleItem) => {
        return {
          class_id,
          weekday: scheduleItem.weekday,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });

      await trx("class_schedule").insert(classSchedule);

      await trx.commit();

      return response.status(201).send();
    } catch (error) {
      console.log(error);
      await trx.rollback();
      next(error);
    }
  }

  static async update(
    request: Request | any,
    response: Response,
    next: NextFunction
  ) {
    const { whatsapp, bio, subject, cost, schedule } = request.body;
    const uid = request.userId;

    const trx = await db.transaction();

    try {
      const updatedProfessorId = await trx("professor")
        .update({
          whatsapp,
          bio,
        })
        .where("user_id", "=", uid);

      const updatedClassesId = await trx("classes")
        .update({
          subject,
          cost,
        })
        .where("prof_id", "=", updatedProfessorId);

      const classSchedule = schedule.map((scheduleItem: IScheduleItem) => {
        return {
          class_id: updatedClassesId,
          weekday: scheduleItem.weekday,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });

      await trx("class_schedule")
        .where("class_id", "=", updatedClassesId)
        .del();

      await trx("class_schedule").insert(classSchedule);

      await trx.commit();

      return response.status(201).send();
    } catch (error) {
      await trx.rollback();
      next(error);
    }
  }
}
