import { Request, Response, NextFunction } from "express";

import { convertMinutesToHour } from "../utils/timeConversion";
import db from "../database/connection";
import paginate from "../utils/pagination";

export default class FavoritesController {
  static async index(request: Request, response: Response, next: NextFunction) {
    const filters = request.query;
    const page = parseInt(filters.page as string);
    const limit = parseInt(filters.limit as string);
    const { uid } = request.params;

    if (!uid || !filters.page || !filters.limit) {
      return response.status(400).json({
        error: "Missing filters to search favorites",
      });
    }

    try {
      const favorites = await db("favorites")
        .select("prof_id")
        .where("user_id", uid);

      const classes = await Promise.all(
        favorites.map(async (fav) => {
          const [classes] = await db("classes")
            .where("prof_id", fav.prof_id)
            .join("professor", "classes.prof_id", "=", "professor.id")
            .select(["classes.*", "professor.*"]);
          return classes;
        })
      );
      const classesWithSchedule = await Promise.all(
        classes.map(async (class_item) => {
          const schedule = await db("classes")
            .join(
              "class_schedule",
              "classes.id",
              "=",
              "class_schedule.class_id"
            )
            .select(["class_schedule.*"])
            .where("class_schedule.class_id", class_item.id);
          const scheduleTimeConverted = schedule.map((scheduleItem) => {
            return {
              ...scheduleItem,
              from: convertMinutesToHour(scheduleItem.from),
              to: convertMinutesToHour(scheduleItem.to),
            };
          });
          return {
            ...class_item,
            schedule: scheduleTimeConverted,
          };
        })
      );
      return response.json(paginate(classesWithSchedule, page, limit));
    } catch (error) {
      next(error);
    }
  }

  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { uid, prof_id } = request.body;

    try {
      await db("favorites").insert({ user_id: uid, prof_id });
      return response.status(201).send();
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { prof_id, user_id } = request.query;

    try {
      await db("favorites").where({ prof_id, user_id }).del();
      return response.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}
