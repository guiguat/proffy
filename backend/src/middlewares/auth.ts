import jwt from "jsonwebtoken";
import { promisify } from "util";
import { NextFunction, Request, Response } from "express";

const authMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader == null) {
    return res.status(401).send({ error: "Token não enviado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = await promisify(jwt.verify)(
      token,
      String(process.env.ACCESS_TOKEN_SECRET)
    );
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).send({ error: "Token invalido" });
  }
};

export default authMiddleware;
