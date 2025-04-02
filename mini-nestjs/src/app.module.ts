import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserController } from "./user.controller";
import { LoggerModule } from "./logger.module";
import { CoreModule } from "./core.module";
import { DynamicConfigModule } from "./dynamicConfig.module";
import { AppService } from "./app.service";
import { LoggerMiddleware } from "./logger.middleware";
import { loggerFunction } from "./logger-function.middleware";
import { APP_FILTER } from "@nestjs/core";
import { CustomExceptionFilterUseProvider } from "./custom-exception.filter";
@Module({
  controllers: [AppController, UserController],
  // 导入模块
  imports: [LoggerModule, CoreModule, DynamicConfigModule.forRoot("456")],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilterUseProvider,
    },
  ],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 针对 GET /middle 路由应用logger中间键
    consumer
      // .apply(LoggerMiddleware)
      .apply(loggerFunction)
      // .forRoutes("middle");
      .forRoutes(
        { path: "middle", method: RequestMethod.GET },
        { path: "user", method: RequestMethod.GET }
      )
      .exclude({ path: "user/query", method: RequestMethod.GET });
  }
}
