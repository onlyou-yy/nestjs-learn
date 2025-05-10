import { ArgumentsHost } from "@nestjs/common";

export interface ExecutionContext extends ArgumentsHost {
  // 用来获取当前处理类，也就是控制器类
  getClass<T = any>(): T;
  // 用来获取路由处理函数
  getHandler(): Function;
}
