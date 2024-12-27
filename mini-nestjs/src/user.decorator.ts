import { createParamDecorator } from "@nestjs/common";

// 自定义参数装饰器
export const User = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  return data ? req.user[data] : req.user;
});
