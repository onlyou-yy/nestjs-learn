import "reflect-metadata";
import { INJECTED_TOKENS } from "./constants";

export function Inject(token: string): ParameterDecorator {
  // 参数装饰器
  // 当装饰的是构造函数的参数时target是类本身,当装饰器装饰的是方法的参数时target是控制器原型
  return function (target: any, key: string, index: number) {
    // Inject 装饰器是使用在控制器的构造函数中,所以target是类本身
    // 类只有一个构造器，所以元数据定义在类上就好
    const params = Reflect.getMetadata(INJECTED_TOKENS, target) || [];
    params[index] = token;
    Reflect.defineMetadata(INJECTED_TOKENS, params, target);
  };
}
