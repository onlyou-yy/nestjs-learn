import "reflect-metadata";

class MyClass {
  private myProperty: string;
  constructor(value: string) {
    this.myProperty = value;
  }
  // @Reflect.metadata("customKey", "customValue") 是一个语法糖，相当于:
  // Reflect.defineMetadata("customKey", "customValue", MyClass.prototype, "myMethod")
  @Reflect.metadata("customKey", "customValue1")
  myMethod() {
    console.log("exec myMethod");
  }
}

const instance = new MyClass("hello");

//定义元数据
// Reflect.defineMetadata(key,value,target,targetProperty);
// 也可以直接使用 @Reflect.metadata() 装饰器来定义
// 给 instance 定义一个元数据
Reflect.defineMetadata("insKey", "insValue", instance);
// 给 instance 的 myProperty 属性定义元数据
Reflect.defineMetadata("pKey", "pValue", instance, "myProperty");
// 给 instance 的 myMethod 方法定义元数据,
Reflect.defineMetadata("customKey", "customValue2", instance, "myMethod");

//检查是否具有指定的元数据
const insHasMeta = Reflect.hasMetadata("insKey", instance);
const pHasMeta = Reflect.hasMetadata("pKey", instance, "myProperty");
console.log(
  `instance has meta insKey: ${insHasMeta}, instance.myProperty has meta pKey: ${pHasMeta}`
);

//获取元数据
const insMeta = Reflect.getMetadata("insKey", instance);
const pMeta = Reflect.getMetadata("pKey", instance, "myProperty");
console.log(
  `instance meta insKey: ${insMeta}, instance.myProperty meta pKey: ${pMeta}`
);

// 获取自有的元数据(针对方法)
// 获取通过 @Reflect.metadata() 装饰器定义的元数据
const methodMeta1 = Reflect.getOwnMetadata(
  "customKey",
  Reflect.getPrototypeOf(instance),
  "myMethod"
);
console.log(`method meta1: ${methodMeta1}`);
// 获取通过 Reflect.defineMetadata() 定义的元数据
const methodMeta2 = Reflect.getOwnMetadata("customKey", instance, "myMethod");
console.log(`method meta2: ${methodMeta2}`);
