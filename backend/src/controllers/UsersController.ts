import { Request, Response, NextFunction } from "express";

import db from "../database/connection";
import bcrypt from "bcrypt";
import { genToken } from "../utils/jwt";
interface IUser {
  name: string;
  email: string;
  password: string;
}

export default class UsersController {
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

  static async auth(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const [user] = await db("user").select("*").where("email", email);
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }

      if (bcrypt.compareSync(password, user.password))
        return res
          .status(202)
          .json({ authorized: true, token: genToken(user.id) });
      else {
        return res.status(400).json({ error: "Senha inválida" });
      }
    } catch (err) {
      next(err);
    }
  }
}
