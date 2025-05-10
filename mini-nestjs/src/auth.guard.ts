import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Roles2 } from "./roles.decorator";
import { LoggerService } from "./logger.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private logger: LoggerService) {}
  canActivate(context: ExecutionContext): boolean {
    this.logger?.log("AuthGuard logger");
    // 从处理程序的方法上获取定义的元数据
    const roles = this.reflector.get("roles", context.getHandler());
    if (!roles) return true;
    const req = context.switchToHttp().getRequest<Request>();
    const user = { id: 1, name: "jack", roles: [req.query.role] };
    return matchRoles(roles, user.roles);
  }
}

@Injectable()
export class AuthGuard2 implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // 从处理程序的方法上获取定义的元数据
    const roles = this.reflector.get(Roles2, context.getHandler());
    if (!roles) return true;
    const req = context.switchToHttp().getRequest<Request>();
    const user = { id: 1, name: "jack", roles: [req.query.role] };
    return matchRoles(roles, user.roles);
  }
}

function matchRoles(roles, userRoles) {
  return userRoles.some((userRole) => roles.includes(userRole));
}
