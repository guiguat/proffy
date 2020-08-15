import { Request, Response, NextFunction } from "express";

import db from "../database/connection";
import bcrypt from "bcrypt";
import { convertMinutesToHour } from "../utils/timeConversion";

interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export default class UserController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const { name, email, password }: IUser = req.body;
    try {
      const securePassword = bcrypt.hashSync(password, bcrypt.genSaltSync(13));
      await db("user").insert({ name, email, password: securePassword });
      return res.status(201).json({ message: "Usuario criado com sucesso!" });
    } catch (err) {
      next(err);
    }
  }

  static async index(req: Request, res: Response, next: NextFunction) {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({
        error: "Id de usuário não especificado",
      });
    }

    try {
      const [prof] = await db("professor").select("id").where("user_id", uid);
      if (!prof) {
        const [user] = await db("user")
          .select("name", "email")
          .where("id", uid);
        return res.json(user);
      }
      const classes = await db("classes")
        .where("prof_id", prof.id)
        .join("professor", "classes.prof_id", "=", "professor.id")
        .select(["classes.*", "professor.*"]);

      const classesWithSchedule = await Promise.all(
        classes.map(async ({ id, ...rest }) => {
          const schedule = await db("classes")
            .join(
              "class_schedule",
              "classes.id",
              "=",
              "class_schedule.class_id"
            )
            .select(["class_schedule.*"])
            .where("class_schedule.class_id", id);
          const scheduleTimeConverted = schedule.map((scheduleItem) => {
            return {
              weekday: scheduleItem.weekday,
              from: convertMinutesToHour(scheduleItem.from),
              to: convertMinutesToHour(scheduleItem.to),
            };
          });

          const [{ email }] = await db("user").select("email").where("id", uid);

          return {
            ...rest,
            email,
            schedule: scheduleTimeConverted,
          };
        })
      );
      return res.json(classesWithSchedule);
    } catch (error) {
      next(error);
    }
  }
}
