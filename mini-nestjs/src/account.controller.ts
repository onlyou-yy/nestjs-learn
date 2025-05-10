import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard, AuthGuard2 } from "./auth.guard";
import { Roles, Roles2 } from "./roles.decorator";

@Controller("account")
export class AccountController {
  constructor() {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles("admin") // 用来标明可以访问该路由的角色
  index() {
    return "has permission visit";
  }

  @Get("role2")
  @UseGuards(AuthGuard2)
  @Roles2(["admin"]) // 用来标明可以访问该路由的角色
  role2() {
    return "Roles2 has permission visit";
  }

  @Get("global")
  @Roles("admin") // 用来标明可以访问该路由的角色
  global() {
    return "global has permission visit";
  }
}
