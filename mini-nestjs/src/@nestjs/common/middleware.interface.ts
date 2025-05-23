import { NextFunction, Request, Response } from "express";

export interface NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void;
}
