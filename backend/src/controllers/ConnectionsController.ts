import { Request, Response } from "express";

import db from "../database/connection";

export default class ClassesController {
  static async index(request: Request, response: Response) {
    const totalConnections = await db("connections").count("* as total");

    const { total } = totalConnections[0];

    return response.json({ total });
  }

  static async create(request: Request, response: Response) {
    const { prof_id } = request.body;

    await db("connections").insert({
      prof_id,
    });

    return response.status(201).send();
  }
}
