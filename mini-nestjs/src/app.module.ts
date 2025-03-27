import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserController } from "./user.controller";
import { LoggerModule } from "./logger.module";
@Module({
  controllers: [AppController, UserController],
  // 导入模块
  imports: [LoggerModule],
})
export class AppModule {}
