import "reflect-metadata";

// 定义一个装饰器,用来标记类
function Injectable(target: any) {
  // 这里面可以不用写任何代码，此装饰器不需要执行任何操作，仅仅用于元数据的生成
}

@Injectable
class Oil {
  constructor(public price: number) {}
}

@Injectable
class Engine {
  constructor(private oil: Oil, private power: number) {}
  start() {
    console.log("引擎启动");
  }
}

@Injectable
class Car {
  constructor(private engine: Engine) {}
  drive() {
    this.engine.start();
  }
}

// 定义一个 DI 容器,用来管理对象的依赖关系
class DIContainer {
  private services = new Map<string, any>();
  // 注册服务,用来保存依赖
  register<T>(name: string, service: any) {
    this.services.set(name, service);
  }
  // 解析服务,取出服务
  resolve<T>(name: string): T {
    const Service = this.services.get(name);
    if (!Service) {
      throw new Error(`Service ${name} not found`);
    }
    if (Service instanceof Function) {
      // 是一个类
      // 获取实现类的构造函数参数的类型数组
      // 通过 @Injectable() 装饰器注入的依赖
      const dependencies =
        Reflect.getMetadata("design:paramtypes", Service) ?? []; // [Engine]

      const type = Reflect.getMetadata("design:type", Service) ?? [];

      const retype = Reflect.getMetadata("design:returntype", Service) ?? [];
      // 递归解析依赖
      const injections = dependencies.map((dependency: any) =>
        this.resolve(dependency.name)
      );
      // 创建服务实例
      return new Service(...injections);
    } else if (Service.useFactory) {
      // 是一个类的工厂方法
      const params = Service.inject || [];
      return Service.useFactory(...params);
    } else if (Service.useValue) {
      // 是一个类的实例
      return Service.useValue;
    }
  }
}

// 创建 DI 容器
const container = new DIContainer();
// 当类的构造方法除了需要注入的依赖之外,还需要其他的参数时,可以使用 useFactory 方法 和 useValue 方法
container.register<Oil>("Oil", {
  provide: "Oil",
  inject: [100],
  useFactory: (price: number) => {
    return new Oil(price);
  },
});
container.register<Engine>("Engine", {
  provide: "Engine",
  useValue: new Engine(new Oil(200), 180),
});
container.register<Car>("Car", Car);
const car = container.resolve<Car>("Car");
car.drive();
