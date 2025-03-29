import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserController } from "./user.controller";
import { LoggerModule } from "./logger.module";
import { CoreModule } from "./core.module";
import { DynamicConfigModule } from "./dynamicConfig.module";
import { AppService } from "./app.service";
@Module({
  controllers: [AppController, UserController],
  // 导入模块
  imports: [LoggerModule, CoreModule, DynamicConfigModule.forRoot()],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
