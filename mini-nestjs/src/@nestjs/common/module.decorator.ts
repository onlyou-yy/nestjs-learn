import "reflect-metadata";

interface IModuleMetadata {
  controllers?: Function[];
  providers?: any[];
  imports?: Function[];
  exports?: any[];
}

// ClassDecorator 类装饰器

export function Module(metadata: IModuleMetadata): ClassDecorator {
  return function (target: Function) {
    // 在类上定义元数据
    // 控制器，也就是路由类
    Reflect.defineMetadata("controllers", metadata.controllers, target);
    // 服务，也就是业务类
    Reflect.defineMetadata("providers", metadata.providers, target);
    // 导入的模块
    Reflect.defineMetadata("imports", metadata.imports, target);
    // 导出的服务
    Reflect.defineMetadata("exports", metadata.exports, target);
  };
}
