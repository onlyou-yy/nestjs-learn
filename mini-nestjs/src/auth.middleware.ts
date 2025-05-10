import { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    /**
     * 一般会在这里给req.user赋值
     * 如何赋值关键要看使用哪种鉴权方式，一般有两种 session JWT
     * 如果上次用户登录后把用户信息保存在session中的话
     * req.user = req.session.user;
     * 如果使用的是JWT
     * JWT -> user -> req.user = user;
     */
    next();
  }
}
