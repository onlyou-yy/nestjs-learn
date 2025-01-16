import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserController } from "./user.controller";
import {
  FactoryService,
  LoggerClassService,
  LoggerService,
  UserLoggerService,
} from "./logger.service";
@Module({
  controllers: [AppController, UserController],
  providers: [
    LoggerClassService, // 可以直接写一个类
    {
      provide: "SUFFIX",
      useValue: "suffix", // 值可以是任意的数据
    },
    {
      // 这种和第一种是一样的，取值也是通过默认注入或者 @Inject(LoggerService) 取出
      provide: LoggerService,
      useClass: LoggerService,
    },
    {
      provide: "UserLog",
      useValue: new UserLoggerService(), // 可以写一个类的实例
    },
    {
      provide: "FactoryLog",
      // 可以是工厂函数，inject是依赖的参数，其中的值可以是任意的
      // 并且如果其中的值是 providers 中的provide中有的值就会被替换成对应的数据
      inject: ["prefix", "SUFFIX"],
      useFactory: (prefix, suffix) => new FactoryService(prefix, suffix),
    },
  ],
})
export class AppModule {}
