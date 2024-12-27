import "reflect-metadata";
import express, { Express, NextFunction } from "express";
import { Logger } from "./logger";
import { ClassConstructor, ExpressRequest, ExpressResponse } from "./types";
import path from "node:path";

export class NestApplication {
  private readonly app: Express = express();
  // module 就是入口模块类
  constructor(protected readonly module: ClassConstructor) {}
  // 初始化，配置路由
  async init() {
    // 1.读取模块管理的controllers元数据
    const controllers: ClassConstructor[] =
      Reflect.getMetadata("controllers", this.module) || [];
    Logger.log(
      `${this.module.name} dependencies initialized`,
      "InstanceLoader"
    );

    // 2.读取控制器上的路由元数据，然后配置路由
    for (let Controller of controllers) {
      // 创建控制器实例
      const controller = new Controller();
      const prefix = Reflect.getMetadata("prefix", Controller) || "/";
      Logger.log(`${Controller.name} {${prefix}}`, "RouteResolver");

      // 3.读取控制器上被 Get,Post 等装饰器装饰的方法上的元数据
      const controllerPrototype = Controller.prototype;
      for (const methodName of Object.getOwnPropertyNames(
        controllerPrototype
      )) {
        const route =
          Reflect.getMetadata("path", controllerPrototype[methodName]) || "";
        const requestMethod = Reflect.getMetadata(
          "method",
          controllerPrototype[methodName]
        );
        if (!requestMethod) continue;

        //配置路由
        const routePath = path.posix.join("/", prefix, route);
        this.app[requestMethod.toLowerCase()](
          routePath,
          (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            // 处理参数
            const args = this.resolveParams(
              controller,
              methodName,
              req,
              res,
              next
            );
            // 调用控制器上的方法,得到结果
            const rest = controller[methodName](...args);
            res.send(rest);
          }
        );

        Logger.log(
          `Mapped ${requestMethod.toUpperCase()} ${routePath} ${
            Controller.name
          }.${methodName}`,
          "RouteResolver"
        );
      }
    }
    Logger.log(`Nest application successfully started`, "NestApplication");
  }
  /** 解析方法上需要使用的参数 */
  private resolveParams(
    instance: any,
    methodName: string,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    const paramsMetadata =
      Reflect.getMetadata("params", instance, methodName) || [];
    // 生序排列后根据key的类型来获取参数
    return paramsMetadata.map((param) => {
      switch (param.key) {
        case "Request":
        case "Req":
          return req;
        case "Body":
          return req.body;
        case "Query":
          return req.query;
        case "Params":
          return req.params;
        case "Headers":
          return req.headers;
      }
    });
  }
  async listen(port: number) {
    // 调用 express 的 listen 方法启动一个服务
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `Application is running on http://localhost:${port}`,
        "NestApplication"
      );
    });
  }
}
