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
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { CustomExceptionFilterUseProvider } from "./custom-exception.filter";
import { GlobalPipe } from "./global.pipe";
import { AccountController } from "./account.controller";
import { AuthMiddleware } from "./auth.middleware";
import { AuthGuard } from "./auth.guard";
import { PayController } from "./pay.controller";
import { Logging5Interceptor } from "./logger1.interceptor";
@Module({
  controllers: [
    AppController,
    UserController,
    AccountController,
    PayController,
  ],
  // 导入模块
  imports: [LoggerModule, CoreModule, DynamicConfigModule.forRoot("456")],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilterUseProvider,
    },
    // 这样注入的管道可以使用依赖
    {
      provide: APP_PIPE,
      useClass: GlobalPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: Logging5Interceptor,
    },
  ],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 针对 GET /middle 路由应用logger中间键
    consumer
      .apply(AuthMiddleware)
      .forRoutes("*")
      .apply(LoggerMiddleware)
      .forRoutes("middle")
      .apply(loggerFunction)
      .forRoutes({ path: "user", method: RequestMethod.GET })
      .exclude({ path: "user/query", method: RequestMethod.GET });
  }
}
