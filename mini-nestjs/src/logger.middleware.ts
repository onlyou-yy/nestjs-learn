import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LoggerClassService } from "./logger.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: LoggerClassService) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log("LoggerClassService in LoggerMiddleware");
    console.log("LoggerMiddleware", req.originalUrl);
    next();
  }
}
