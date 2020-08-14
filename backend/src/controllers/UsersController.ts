import { Request, Response, NextFunction } from "express";

import db from "../database/connection";
import bcrypt from "bcrypt";
import { genToken } from "../utils/jwt";
import crypto from "crypto";
import MailtrapMailProvider from "../providers/MailtrapMailProvider";

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
}
