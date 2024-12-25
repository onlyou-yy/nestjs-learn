import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";

// 用于定义模块，是组织代码的基本单元，它将相关的组件（控制器，服务器，提供者）相关联再一起
@Module({
  controllers: [AppController],
})
export class AppModule {}
