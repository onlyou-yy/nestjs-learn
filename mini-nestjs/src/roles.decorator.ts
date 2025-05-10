import { SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

// 定义一个 Roles 函数，该函数接收任意数量的角色名，并且返回一个装饰器
export const Roles = (...roles: string[]) => {
  return SetMetadata("roles", roles);
};

export const Roles2 = Reflector.createDecorator<string[]>();