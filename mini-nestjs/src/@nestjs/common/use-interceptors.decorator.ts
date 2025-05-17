import "reflect-metadata";
export function UseInterceptors(...interceptors) {
  return function (target, propertyKey, descriptor) {
    if (descriptor) {
      // 装饰方法
      const existingInterceptors =
        Reflect.getMetadata("interceptors", descriptor.value) ?? [];
      Reflect.defineMetadata(
        "interceptors",
        [...existingInterceptors, ...interceptors],
        descriptor.value
      );
    } else {
      // 装饰类
      const existingInterceptors =
        Reflect.getMetadata("interceptors", target) ?? [];
      Reflect.defineMetadata(
        "interceptors",
        [...existingInterceptors, ...interceptors],
        target
      );
    }
  };
}
