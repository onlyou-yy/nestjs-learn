import express, { Express } from "express";
import { Logger } from "./logger";
export class NestApplication {
  private readonly app: Express = express();
  constructor(protected readonly module) {}
  // 初始化，配置路由
  async init() {}
  async listen(port: number) {
    // 调用 express 的 listen 方法启动一个服务
    this.app.listen(port, () => {
      Logger.log(
        `Application is running on http://localhost:${port}`,
        "NestApplication"
      );
    });
  }
}
