import { ClassConstructor } from "@nestjs/core/types";
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

export function Post(path: string = ""): MethodDecorator {
  return function (
    target: Function,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("path", path, descriptor.value);
    Reflect.defineMetadata("method", "POST", descriptor.value);
  };
}

export function Redirect(url: string, statusCode: number = 302) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("redirectUrl", url, descriptor.value);
    Reflect.defineMetadata("redirectStatusCode", statusCode, descriptor.value);
  };
}

export function HttpCode(code: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("statusCode", code, descriptor.value);
  };
}

export function Header(key: string, value: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const existingMetadata =
      Reflect.getMetadata("headers", descriptor.value) || [];
    existingMetadata.push({ key, value });
    Reflect.defineMetadata("headers", existingMetadata, descriptor.value);
  };
}
