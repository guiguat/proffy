import { Request, Response, NextFunction } from "express";

import db from "../database/connection";
import bcrypt from "bcrypt";

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
    const { id } = req.params;
    try {
      const [user]: IUser[] = await db("user").select("*").where("id", "=", id);
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    // Alterar horário/dias de disponibilidade
    // Alterar o número de WhatsApp
    // Alterar sua biografia
    // Alterar seu valor por hora de aula
  }
}
