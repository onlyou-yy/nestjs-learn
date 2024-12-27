import "reflect-metadata";
import { ClassConstructor } from "@nestjs/core/types";

export const createParamDecorator = (key: string) => {
  // target 是控制器原型
  // propertyKey 是方法名
  // parameterIndex 是参数的索引
  return (data?: any) =>
    (target: any, propertyKey: string, parameterIndex: number) => {
      //给控制器类型的原型的propertyKey方法定义元数据
      //属性名是params 值是一个数组，数组里应该放置数据，表示那个位置使用哪个装饰器

      const existingParams =
        Reflect.getMetadata(`params`, target, propertyKey) || [];
      existingParams[parameterIndex] = {
        parameterIndex,
        key,
        data,
      };
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
