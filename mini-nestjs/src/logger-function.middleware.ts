import { NextFunction, Request, Response } from "express";

export function loggerFunction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("loggerFunction", req.originalUrl);
  next();
}
