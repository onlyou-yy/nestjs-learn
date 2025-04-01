import { NestMiddleware } from "./middleware.interface";
import { RequestMethod } from "./request.method.enum";

export type ClassImplementingInterface<T> = new (...args: any[]) => T;

export interface MiddlewareConsumer {
  /**  应用中间件，可以有多个 */
  apply(
    ...middlewares: Array<
      ClassImplementingInterface<NestMiddleware> | NestMiddleware
    >
  ): this;
  /**  指定哪些路由要使用这些中间件 */
  forRoutes(
    ...routes: Array<
      string | { path: string; method: RequestMethod } | Function
    >
  ): this;
  /**  排除路由 */
  exclude(
    ...routes: Array<string | { path: string; method: RequestMethod }>
  ): this;
}
