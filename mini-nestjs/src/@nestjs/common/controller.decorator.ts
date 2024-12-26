import "reflect-metadata";

interface ControllerOptions {
  prefix: string;
}

// 前缀 prefix 可以不穿，可以是一个字符串或者数组，对于多种情况可以使用联合类型定义参数之后在函数内判断类型
// 也可以使用函数重载
export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(prefix: ControllerOptions): ClassDecorator;
export function Controller(
  prefixOptions?: string | ControllerOptions
): ClassDecorator {
  let options: ControllerOptions = { prefix: "" };
  if (typeof prefixOptions === "string") {
    options.prefix = prefixOptions;
  } else {
    options = prefixOptions;
  }
  return function (target: Function) {
    Reflect.defineMetadata("prefix", options?.prefix || "", target);
  };
}
