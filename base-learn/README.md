## Nest 的依赖包

- @nestjs/core Nest.js 核心模块，提供构建、启动和管理 Nest.js 应用程序的基础设施
- @nestjs/common 包含了构建 Nest.js 应用程序基设施和常用装饰器，像控制器、服务、中间件、守卫、拦 器、管道、异常过滤器等
- rxjs 用于构建异步和事件驱动程序的库。
- reflect-metadata 实现元编程的库，提供元数据反射 AP 工，可以在运行时检查和操作对象的元数据
- @nestjs/platform-express Nest 的 Express 平台适紀器，提供中间件、路山等功能

### 报错解决

**_ 使用方法装饰器 @Get 时报错 _**

需要在 tsconfig.json 中添加以下配置：启用装饰器功能

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

**_ 使用 Promise 时报错 需要新版本的 js _**

需要在 tsconfig.json 中添加以下配置：

```json
{
  "compilerOptions": {
    "target": "ESNext" // 指定按最新nodejs版本来编译
  }
}
```

**_ 报错 @nestjs/core 找不到 _**

需要安装 @nestjs/core 包,并在 tsconfig.json 中添加以下配置：按 node 库的方式解析模块

```json
{
  "compilerOptions": {
    "module": "NodeNext", // 指定生成的模块代码系统
    "moduleResolution": "NodeNext" //按 node 库的方式解析模块
  }
}
```

## Reflect

是一个内置的对象，提供了一些静态方法，用于操作对象的属性和方法。

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect

## reflect-metadata

- 是一个用于 TS 和 ECMA 的元数据反射提案,通过提供对元数据定义和检查的支持,简化了装饰器的使用
- 可以在类、方法、属性、参数等上添加元数据,并在运行时获取这些元数据（就是将数据附加到指定位置上，在需要时去对应地方获取）

```ts
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
const methodMeta2 = Reflect.getMetadata("customKey", instance, "myMethod");
console.log(`method meta2: ${methodMeta2}`);

// 删除数据
Reflect.deleteMetadata("insKey", instance);
const delInsMeta = Reflect.getMetadata("insKey", instance);
console.log(`instance meta insKey: ${delInsMeta}`);
```

## 装饰器

https://www.tslang.cn/docs/handbook/decorators.html#class-decorators
https://www.bookstack.cn/read/wangdoc-typescript-tutorial/docs-decorator.md

```ts
// 为类扩展类功能,比如添加新属性
// new (...args: any[]) => {} 或者 new (...args: any[]) 表示构造函数
function addTimestamp<T extends new (...args: any[]) => {}>(target: T) {
  // target.prototype.timestamp = Date.now();
  // 也可以
  return class extends target {
    timestamp = Date.now();
  };
}

interface Document {
  timestamp: number;
}

@addTimestamp
class Document {
  constructor(public title: string) {}
}

const doc = new Document("Hello");
console.log(doc.title); // Hello
console.log(doc.timestamp); // 1679100990494

export {};
```

- 需要注意的是装饰器的是在编译时执行的,而不是在运行时执行的。
- 属性装饰器,方法装饰器,访问器装饰器按照在类中出现的顺序,从上往下依次执行,类装饰器最后执行。
- 参数装饰器先于方法装饰执行,并且如果有多个参数和多个参数装饰器,执行顺序是从右往左执行的。
- 多个装饰器装饰一个目标时会按照从下到上的顺序依次执行(也就是从最接近目标的装饰器开始往外执行).
