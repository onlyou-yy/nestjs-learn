import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  // 创建一个 app 实例
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
