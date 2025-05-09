import { ClassImplementingInterface, PipeTransform } from "@nestjs/common";

export function UsePipes(
  ...pipes: Array<ClassImplementingInterface<PipeTransform> | PipeTransform>
) {
  return function (
    target: Function | object,
    propertyKey?: string,
    descriptor?
  ) {
    if (descriptor) {
      // 是方法
      Reflect.defineMetadata("pipes", pipes, descriptor.value);
    } else {
      Reflect.defineMetadata("pipes", pipes, target);
    }
  };
}
