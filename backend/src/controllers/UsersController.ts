import { Request, Response, NextFunction } from "express";

import db from "../database/connection";
import bcrypt from "bcrypt";
import { genToken } from "../utils/jwt";
import IMailProvider from "../providers/IMailProvider";
import crypto from "crypto";
import MailtrapMailProvider from "../providers/MailtrapMailProvider";

interface IUser {
  name: string;
  email: string;
  password: string;
}

export default class UsersController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { name, email, password }: IUser = req.body;
    try {
      const securePassword = bcrypt.hashSync(password, bcrypt.genSaltSync(13));
      await db("user").insert({ name, email, password: securePassword });
      return res.status(201).json({ message: "Usuario criado com sucesso!" });
    } catch (err) {
      next(err);
    }
  }

  async auth(req: Request, res: Response, next: NextFunction) {
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

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.query;
    console.log();
    try {
      const [user] = await db("user")
        .select("*")
        .where("email", "=", String(email));
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      const pwd_reset_token = crypto.randomBytes(20).toString("hex");
      const pwd_reset_expires = new Date();
      pwd_reset_expires.setHours(pwd_reset_expires.getHours() + 1);

      await db("user")
        .update({ pwd_reset_token, pwd_reset_expires })
        .where("email", "=", String(email));

      const mailProvider = new MailtrapMailProvider();
      await mailProvider.sendMail(
        {
          from: { email: "guaturadzn@gmail.com", name: "Guilherme Guatura" },
          to: { email: user.email, name: user.name },
          template: "auth/forgot_password",
          subject: "Recuperar senha",
          context: { token: pwd_reset_token },
        },
        (err) => {
          if (err) {
            console.log(err);
            return res
              .status(400)
              .json({ error: "Não foi possível enviar email de recuperação" });
          }
          return res.status(201).send();
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { email, token, password } = req.body;
    try {
      const [user] = await db
        .from("user")
        .where("email", "=", email)
        .select("pwd_reset_token", "pwd_reset_expires");
      if (!user)
        return res.status(400).json({ error: "Usuario não encontrado" });

      if (token != user.pwd_reset_token)
        return res.json({ error: "Token inválido" });

      const now = new Date();

      if (now > user.pwd_reset_expires)
        return res.status(400).json({ error: "Token expirado, gere um novo!" });

      const securePassword = bcrypt.hashSync(password, bcrypt.genSaltSync(13));
      await db("user")
        .update({ password: securePassword })
        .where("email", "=", email);
      return res.status(201).json({ message: "Senha alterada com sucesso!" });
    } catch (error) {
      next(error);
    }
  }
}
