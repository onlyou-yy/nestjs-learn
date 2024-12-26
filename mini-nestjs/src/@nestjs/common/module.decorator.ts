interface IModuleMetadata {
  controllers: any[];
}

// ClassDecorator 类装饰器

export function Module(metadata: IModuleMetadata): ClassDecorator {
  return function (target: Function) {
    target.prototype.controllers = metadata.controllers;
  };
}
