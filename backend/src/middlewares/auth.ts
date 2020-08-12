import jwt from "jsonwebtoken";
import { promisify } from "util";
import { NextFunction, Request, Response } from "express";

const authMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "Token não enviado" });
  }

  const [scheme, token] = authHeader.split(" ");

  try {
    const decoded: any = await promisify(jwt.verify)(token, "secret");

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).send({ error: "Token invalido" });
  }
};

export default authMiddleware;
