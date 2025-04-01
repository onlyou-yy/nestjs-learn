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
@Module({
  controllers: [AppController, UserController],
  // 导入模块
  imports: [LoggerModule, CoreModule, DynamicConfigModule.forRoot("456")],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 针对 GET /middle 路由应用logger中间键
    consumer
      .apply(LoggerMiddleware)
      // .forRoutes("middle");
      .forRoutes({ path: "middle", method: RequestMethod.GET });
  }
}
