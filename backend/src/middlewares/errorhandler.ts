import { NextFunction, Request, Response } from "express";
interface ResponseError extends Error {
  status?: number;
}
export default function errorMiddleware(
  error: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(error.status || 500);
  res.json({
    message: "Ocorreu um erro ao completar ação, tente novamente.",
    error: error.message,
  });
}
