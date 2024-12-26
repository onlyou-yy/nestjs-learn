export function Get(path?: string): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = function () {
      return "index";
    };
  };
}
