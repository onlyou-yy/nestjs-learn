import "reflect-metadata";
import express, { Express, NextFunction } from "express";
import { Logger } from "./logger";
import { ClassConstructor, ExpressRequest, ExpressResponse } from "./types";
import path, { relative } from "node:path";
import { DESIGN_PARAM_TYPES, INJECTED_TOKENS } from "@nestjs/common/constants";
import {
  ClassImplementingInterface,
  defineModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { NestMiddleware } from "@nestjs/common";

export class NestApplication implements MiddlewareConsumer {
  private readonly app: Express = express();
  // 保存全部的 providers
  // private readonly providers = new Map();
  // 保存所有的provider的实例，key就是token，value就是实例或者值
  private readonly providerInstances = new Map();
  // 保存每个模块里有哪些provider的token
  private readonly moduleProviders = new Map();
  // 保存全局的 provider
  private readonly globalProviders = new Set();
  // 记录所有的中间件,可能是类、函数、实例
  private readonly middlewares = [];
  // 记录中间件要排除的路径
  private readonly excludeRoutes = [];
  // module 就是入口模块类
  constructor(protected readonly module: ClassConstructor) {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  use(middleware: any) {
    this.app.use(middleware);
  }
  /**
   * 初始化中间件
   */
  initMiddleware() {
    this.module.prototype.configure?.(this);
  }
  apply(
    ...middlewares: Array<
      ClassImplementingInterface<NestMiddleware> | NestMiddleware
    >
  ) {
    // 将中间件添加到模块中，方便后续解析依赖获取provider
    defineModule(this.module, middlewares);
    this.middlewares.push(...middlewares);
    return this;
  }
  forRoutes(
    ...routes: Array<string | { path: string; method: RequestMethod }>
  ) {
    for (const route of routes) {
      // 把 route 格式化成标准对象
      const { routePath, routeMethod } = this.normalizeRouteInfo(route);
      for (const middleware of this.middlewares) {
        this.app.use(routePath, (req, res, next) => {
          // 排除路径
          if (this.isExcluded(req.originalUrl, req.method)) {
            return next();
          }
          // 如果配置的方法名是All，或者方法名完全匹配
          if (routeMethod === RequestMethod.ALL || routeMethod === req.method) {
            if ("use" in middleware.prototype || "use" in middleware) {
              const ins = this.getMiddlewareInstance(middleware);
              ins.use(req, res, next);
            } else if (middleware instanceof Function) {
              middleware(req, res, next);
            } else {
              next();
            }
          } else {
            next();
          }
        });
      }
    }
    return this;
  }
  exclude(
    ...routes: Array<string | { path: string; method: RequestMethod }>
  ): this {
    this.excludeRoutes.push(...routes.map(this.normalizeRouteInfo));
    return this;
  }
  isExcluded(reqPath: string, method: RequestMethod | string) {
    return this.excludeRoutes.some(
      (route) =>
        route.routePath === reqPath &&
        (route.routeMethod === RequestMethod.ALL ||
          route.routeMethod === method)
    );
  }
  /** 获取中间件实例 */
  getMiddlewareInstance(middleware) {
    if (middleware instanceof Function) {
      const dependencies = this.resolveDependencies(middleware);
      return new middleware(...dependencies);
    }
    return middleware;
  }
  /** 把 route 格式化成标准对象 */
  private normalizeRouteInfo(
    route: string | { path: string; method: RequestMethod } | Function
  ) {
    let routePath = "";
    let routeMethod = RequestMethod.ALL;
    if (typeof route === "string") {
      routePath = route;
    } else if ("path" in route) {
      routePath = route.path;
      routeMethod = route.method ?? RequestMethod.ALL;
    } else if (route instanceof Function) {
      // route 是一个控制器
      routePath = Reflect.getMetadata("prefix", route);
    }
    // cats => /cats
    routePath = path.posix.join("/", routePath);
    return {
      routePath,
      routeMethod,
    };
  }
  /**
   * 初始化 providers
   */
  async initProviders() {
    // 重写注册providers的流程
    // 获取导入的模块，并手机导入模块的 providers
    const imports = Reflect.getMetadata("imports", this.module) ?? [];
    for (let importModule of imports) {
      let importedModule = importModule;
      if (importModule instanceof Promise) {
        importedModule = await importModule;
      }
      if ("module" in importedModule) {
        // 如果是动态模块,合并配置项
        const {
          module,
          providers = [],
          exports = [],
          controllers = [],
        } = importedModule;
        const oldProviders = Reflect.getMetadata("providers", module) ?? [];
        const newProviders = [...oldProviders, ...providers];
        // 关联到模块
        defineModule(module, newProviders);
        // 覆盖module上原来的 providers 和 exports
        Reflect.defineMetadata("providers", newProviders, module);

        const oldControllers = Reflect.getMetadata("controllers", module) ?? [];
        const newControllers = [...oldControllers, ...controllers];
        defineModule(module, newControllers);
        Reflect.defineMetadata("controllers", newControllers, module);

        const oldExports = Reflect.getMetadata("exports", module) ?? [];
        const newExports = [...oldExports, ...exports];
        Reflect.defineMetadata("exports", newExports, module);
        this.registerProvidersFromModule(module, this.module);
      } else {
        this.registerProvidersFromModule(importedModule, this.module);
      }
    }
    // 收集自身模块的providers
    const providers = Reflect.getMetadata("providers", this.module) || [];
    const isGlobal = Reflect.getMetadata("global", this.module);
    for (const provider of providers) {
      this.addProvider(provider, this.module, isGlobal);
    }
  }
  /** 从 module 中提取 provider 并进行注册 */
  registerProvidersFromModule(module, ...parentModules) {
    const isGlobal = Reflect.getMetadata("global", module);
    // 获取导出的模块，不过可能没有全部导出，需要使用 exports 进行过滤
    const exports = Reflect.getMetadata("exports", module) ?? [];
    const importedProviders = Reflect.getMetadata("providers", module) ?? [];

    // 遍历exports,从 importedProviders 中取出导出的 provider
    for (let exportToken of exports) {
      // exportToken 可以是 Module 也可能是 provider
      if (this.isModule(exportToken)) {
        // 如果是模块那么就递归进行处理
        this.registerProvidersFromModule(exportToken, module, ...parentModules);
      } else {
        const provider = importedProviders.find(
          (provider) =>
            provider === exportToken || provider.provide === exportToken
        );
        if (provider) {
          [module, ...parentModules].forEach((module) => {
            this.addProvider(provider, module, isGlobal);
          });
        }
      }
    }
  }
  /** 判断是否是模块 */
  isModule(exportToken) {
    return (
      exportToken &&
      exportToken instanceof Function &&
      Reflect.getMetadata("isModule", exportToken)
    );
  }
  /** 添加 provider 到全局 */
  addProvider(provider: any, module, isGlobal = false) {
    // 这个providers代表module对应的provider的token
    const providers: Set<any> = isGlobal
      ? this.globalProviders
      : this.moduleProviders.get(module) || new Set();

    if (!this.moduleProviders.get(module)) {
      this.moduleProviders.set(module, providers);
    }
    // 处理循环依赖的情况，已经收集过的就不再进行收集
    const injectToken = provider.provide ?? provider;
    if (this.providerInstances.has(injectToken)) {
      providers.add(injectToken);
      return;
    }
    if (provider.provide && provider.useClass) {
      // 解析出类上的依赖
      const dependencies = this.resolveDependencies(provider.useClass);
      // provide 是一个类
      const classInstance = new provider.useClass(...dependencies); // TODO 这里的类可以会有其他依赖
      // 把依赖的实例存到容器中
      this.providerInstances.set(provider.provide, classInstance);
      providers.add(provider.provide);
    } else if (provider.provide && provider.useValue) {
      // provide 是一个实例
      this.providerInstances.set(provider.provide, provider.useValue);
      providers.add(provider.provide);
    } else if (provider.provide && provider.useFactory) {
      const inject = provider.inject || [];
      const depts = inject.map((item) => this.getProviderByToken(item, module));
      // provide 是一个工厂函数
      this.providerInstances.set(
        provider.provide,
        provider.useFactory(...depts)
      ); // TODO 这里的类可以会有其他依赖
      providers.add(provider.provide);
    } else if (provider instanceof Function) {
      // provider 就是一个类
      const dependencies = this.resolveDependencies(provider);
      this.providerInstances.set(provider, new provider(...dependencies));
      providers.add(provider);
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
  getProviderByToken(token, module) {
    // 当前模块或全局中是否有provider
    if (
      this.moduleProviders.get(module)?.has(token) ||
      this.globalProviders.has(token)
    ) {
      return this.providerInstances.get(token);
    } else {
      return null;
    }
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
      const module = Reflect.getMetadata("nestModule", classes);
      return this.getProviderByToken(injectedTokens[index] ?? token, module);
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
    await this.initProviders();
    await this.initMiddleware();
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
