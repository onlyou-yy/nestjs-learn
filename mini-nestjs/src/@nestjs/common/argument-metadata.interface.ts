type Type<T> = T;

export interface ArgumentMetadata {
  type: "body" | "query" | "param" | "custom";
  metatype?: any; //数据的原始类型
  data?: string; // 传递给装饰器的字符串
}
