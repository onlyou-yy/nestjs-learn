import "reflect-metadata";

interface IModuleMetadata {
  controllers?: Function[];
  providers?: any[];
  imports?: (Function | DynamicModule)[];
  exports?: any[];
}

export interface DynamicModule extends IModuleMetadata {
  module: Function;
}

// ClassDecorator 类装饰器

export function Module(metadata: IModuleMetadata): ClassDecorator {
  return function (target: Function) {
    // 在类上定义元数据
    Reflect.defineMetadata("isModule", true, target);
    // 为 controllers 增加标识
    defineModule(target, metadata.controllers);
    // 控制器，也就是路由类
    Reflect.defineMetadata("controllers", metadata.controllers, target);
    // 为 providers 增加标识
    // let providers = (metadata.providers ?? [])
    //   .map((provider) => {
    //     if (provider instanceof Function) {
    //       return provider;
    //     } else if (provider?.useClass instanceof Function) {
    //       return provider.useClass;
    //     } else {
    //       return null;
    //     }
    //   })
    //   .filter(Boolean);
    defineModule(target, metadata.providers ?? []);
    // 服务，也就是业务类
    Reflect.defineMetadata("providers", metadata.providers, target);
    // 导入的模块
    Reflect.defineMetadata("imports", metadata.imports, target);
    // 导出的模块或服务
    Reflect.defineMetadata("exports", metadata.exports, target);
  };
}

/**
 * 为 provider|controller 添加标识,用来区分这个provider 是属于哪个模块的
 * @param nestModule 模块
 * @param targets providers 数组
 */
export function defineModule(nestModule, targets = []) {
  // 遍历 targets 数组，为每个元素添加元数据，key是nestModule,value是对应的模块
  targets.forEach((target) => {
    Reflect.defineMetadata("nestModule", nestModule, target);
  });
}

// 注意模块间的循环引用问题，会出bug
/** 全局模块 */
export function Global(): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata("global", true, target);
  };
}
