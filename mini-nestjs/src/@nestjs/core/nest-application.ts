import "reflect-metadata";
import express, { Express, NextFunction } from "express";
import { Logger } from "./logger";
import { ClassConstructor, ExpressRequest, ExpressResponse } from "./types";
import path from "node:path";
import { DESIGN_PARAM_TYPES, INJECTED_TOKENS } from "@nestjs/common/constants";

export class NestApplication {
  private readonly app: Express = express();
  // 保存全部的 providers
  private readonly providers = new Map();
  // module 就是入口模块类
  constructor(protected readonly module: ClassConstructor) {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.initProviders();
  }
  use(middleware: any) {
    this.app.use(middleware);
  }
  // 初始化 providers
  initProviders() {
    // 重写注册providers的流程
    // 获取导入的模块，并手机导入模块的 providers
    const imports = Reflect.getMetadata("imports", this.module) ?? [];
    for (let importModule of imports) {
      const importedProviders =
        Reflect.getMetadata("providers", importModule) ?? [];
      for (const provider of importedProviders) {
        this.addProvider(provider);
      }
    }
    // 收集自身模块的providers
    const providers = Reflect.getMetadata("providers", this.module) || [];
    for (const provider of providers) {
      this.addProvider(provider);
    }
  }
  addProvider(provider: any) {
    // 处理循环依赖的情况，已经收集过的就不再进行收集
    const injectToken = provider.provide ?? provider;
    if (this.providers.has(injectToken)) return;
    if (provider.provide && provider.useClass) {
      // 解析出类上的依赖
      const dependencies = this.resolveDependencies(provider.useClass);
      // provide 是一个类
      const classInstance = new provider.useClass(...dependencies); // TODO 这里的类可以会有其他依赖
      // 把依赖的实例存到容器中
      this.providers.set(provider.provide, classInstance);
    } else if (provider.provide && provider.useValue) {
      // provide 是一个实例
      this.providers.set(provider.provide, provider.useValue);
    } else if (provider.provide && provider.useFactory) {
      const inject = provider.inject || [];
      const depts = inject.map((item) => this.getProviderByToken(item));
      // provide 是一个工厂函数
      this.providers.set(provider.provide, provider.useFactory(...depts)); // TODO 这里的类可以会有其他依赖
    } else if (provider instanceof Function) {
      // provider 就是一个类
      const dependencies = this.resolveDependencies(provider);
      this.providers.set(provider, new provider(...dependencies));
    } else {
      throw new Error("provider is not valid");
    }
  }
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
      // 解析出控制器上的依赖
      const dependencies = this.resolveDependencies(Controller);

      // 创建控制器实例
      const controller = new Controller(...dependencies);
      const prefix = Reflect.getMetadata("prefix", Controller) || "/";
      Logger.log(`${Controller.name} {${prefix}}`, "RouteResolver");

      // 3.读取控制器上被 Get,Post 等装饰器装饰的方法上的元数据
      const controllerPrototype = Controller.prototype;
      for (const methodName of Object.getOwnPropertyNames(
        controllerPrototype
      )) {
        const requestMethod = Reflect.getMetadata(
          "method",
          controllerPrototype[methodName]
        );
        if (!requestMethod) continue;

        const route =
          Reflect.getMetadata("path", controllerPrototype[methodName]) || "";
        const redirectUrl = Reflect.getMetadata(
          "redirectUrl",
          controllerPrototype[methodName]
        );
        const redirectStatusCode = Reflect.getMetadata(
          "redirectStatusCode",
          controllerPrototype[methodName]
        );
        const statusCode = Reflect.getMetadata(
          "statusCode",
          controllerPrototype[methodName]
        );
        const headers = Reflect.getMetadata(
          "headers",
          controllerPrototype[methodName]
        );

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
            // 如果设置了状态码，就强制设置指定状态码
            if (statusCode) {
              res.status(statusCode);
            }
            // 判断是否要重定向
            if (redirectUrl) {
              if (rest && rest.url) {
                return res.redirect(rest.statusCode || 302, rest.url);
              }
              return res.redirect(redirectStatusCode, redirectUrl);
            }
            // 判断是否有使用Response装饰器，如果有就不处理返回
            const responseMetadata = this.getResponseMetadata(
              controller,
              methodName
            );
            // 如果有设置响应头
            if (headers && headers.length) {
              headers.forEach((item) => {
                res.setHeader(item.key, item.value);
              });
            }
            if (!responseMetadata || responseMetadata.data?.passThrough) {
              res.send(rest);
            }
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
  private getResponseMetadata(instance: any, methodName: string) {
    const metadata = Reflect.getMetadata("params", instance, methodName);
    return metadata?.find(
      (item) =>
        item &&
        (item.key === "Response" || item.key === "Res" || item.key === "Next")
    );
  }
  /** 把token转成provider */
  getProviderByToken(token: string) {
    return this.providers.get(token) ?? token;
  }
  /** 解析控制器上需要使用的依赖 */
  private resolveDependencies(classes: ClassConstructor) {
    // 读取类构造器上通过 @Inject 装饰器注入的依赖的Token
    const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, classes) || [];
    // 读取类构造器上参数的类型
    const constructorParams =
      Reflect.getMetadata(DESIGN_PARAM_TYPES, classes) || [];

    // 遍历依赖的Token，然后根据Token从容器中获取对应的实例
    return constructorParams.map((token, index) => {
      //TODO 将每个param中的token默认换成对应的 provider 值
      return this.getProviderByToken(injectedTokens[index] ?? token);
    });
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
      const { key, data } = param;
      // nestjs 上下文
      const ctx = {
        switchToHttp: () => ({
          getRequest: () => req,
          getResponse: () => res,
          getNext: () => next,
        }),
      };
      switch (key) {
        case "Request":
        case "Req":
          return req;
        case "Query":
          return data ? req.query[data] : req.query;
        case "Session":
          return data ? req.session[data] : req.session;
        case "Body":
          return data ? req.body[data] : req.body;
        case "Params":
          return data ? req.params[data] : req.params;
        case "Headers":
          return data ? req.headers[data] : req.headers;
        case "IP":
          return req.ip;
        case "Response":
        case "Res":
          return res;
        case "Next":
          return next;
        case "DecoratorFactory":
          return param.factory(data, ctx);
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
