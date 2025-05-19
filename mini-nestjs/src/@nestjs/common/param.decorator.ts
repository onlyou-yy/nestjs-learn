import "reflect-metadata";
import { DECORATOR_FACTORY } from "@nestjs/core";
import { DESIGN_PARAM_TYPES } from "./constants";

export const createParamDecorator = (keyOrFactory: string | Function) => {
  // target 当装饰的是构造函数的参数时target是类本身,当装饰器装饰的是方法的参数时target是控制器原型
  // propertyKey 是方法名
  // parameterIndex 是参数的索引
  return (data?: any, ...pipes: any[]) =>
    (target: any, propertyKey: string, parameterIndex: number) => {
      //给控制器类型的原型的propertyKey方法定义元数据
      //属性名是params 值是一个数组，数组里应该放置数据，表示那个位置使用哪个装饰器

      const existingParams =
        Reflect.getMetadata(`params`, target, propertyKey) || [];

      const metatype = Reflect.getMetadata(
        DESIGN_PARAM_TYPES,
        target,
        propertyKey
      )[parameterIndex];

      if (keyOrFactory instanceof Function) {
        // 如果传过来的是一个函数的话，存放参数索引，key定死为装饰器工厂，factory就是用来获取值的工厂
        existingParams[parameterIndex] = {
          parameterIndex,
          key: DECORATOR_FACTORY,
          data,
          factory: keyOrFactory,
          pipes,
          metatype,
        };
      } else {
        existingParams[parameterIndex] = {
          parameterIndex,
          key: keyOrFactory,
          data,
          pipes,
          metatype,
        };
      }

      Reflect.defineMetadata(`params`, existingParams, target, propertyKey);
    };
};
export const Request = createParamDecorator("Request");
export const Req = createParamDecorator("Req");
export const Query = createParamDecorator("Query");
export const Headers = createParamDecorator("Headers");
export const Session = createParamDecorator("Session");
export const Body = createParamDecorator("Body");
export const Params = createParamDecorator("Params");
export const IP = createParamDecorator("IP");

// 响应对象,当使用这两个装饰器获取响应对象的时候需要自己管理响应
// 可以设置 passThrough: true 来跳过响应处理 @Response({passThrough: true})
export const Response = createParamDecorator("Response");
export const Res = createParamDecorator("Res");
export const Next = createParamDecorator("Next");

export const UploadedFile = createParamDecorator("UploadedFile");
