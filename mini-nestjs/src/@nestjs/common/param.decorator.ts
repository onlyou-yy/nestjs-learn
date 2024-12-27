import "reflect-metadata";
import { ClassConstructor } from "@nestjs/core/types";

export const createParamDecorator = (key: string) => {
  // target 是控制器原型
  // propertyKey 是方法名
  // parameterIndex 是参数的索引
  return () => (target: any, propertyKey: string, parameterIndex: number) => {
    //给控制器类型的原型的propertyKey方法定义元数据
    //属性名是params 值是一个数组，数组里应该放置数据，表示那个位置使用哪个装饰器

    const existingParams =
      Reflect.getMetadata(`params`, target, propertyKey) || [];
    existingParams[parameterIndex] = {
      parameterIndex,
      key,
    };
    Reflect.defineMetadata(`params`, existingParams, target, propertyKey);
  };
};
export const Request = createParamDecorator("Request");
export const Req = createParamDecorator("Req");
