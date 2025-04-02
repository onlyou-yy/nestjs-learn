import { ClassImplementingInterface, ExceptionFilter } from "@nestjs/common";
import "reflect-metadata";

export function UseFilters(
  ...filters: Array<
    ClassImplementingInterface<ExceptionFilter> | ExceptionFilter
  >
) {
  return function (
    target: Function | object,
    propertyKey?: string,
    descriptor?
  ) {
    if (descriptor) {
      // 是方法
      Reflect.defineMetadata("filters", filters, descriptor.value);
    } else {
      Reflect.defineMetadata("filters", filters, target);
    }
  };
}
