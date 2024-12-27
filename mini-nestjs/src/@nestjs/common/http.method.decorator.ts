import "reflect-metadata";

export function Get(path: string = ""): MethodDecorator {
  /**
   * target 类的原型
   * propertyKey 方法名
   * descriptor 方法的描述符
   */
  return function (
    target: Function,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // descriptor.value 就是方法的实现
    // 定义元数据
    Reflect.defineMetadata("path", path, descriptor.value);
    Reflect.defineMetadata("method", "GET", descriptor.value);
  };
}
