import "reflect-metadata";

interface IModuleMetadata {
  controllers: Function[];
}

// ClassDecorator 类装饰器

export function Module(metadata: IModuleMetadata): ClassDecorator {
  return function (target: Function) {
    // 在类上定义元数据
    Reflect.defineMetadata("controllers", metadata.controllers, target);
  };
}
