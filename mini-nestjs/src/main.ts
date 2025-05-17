import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";
import { CustomExceptionFilterUseClass } from "./custom-exception.filter";
import { ValidationPipe } from "@nestjs/common";
import { Logging4Interceptor } from "./logger1.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: "secret-key", //用于加密会话的密钥
      resave: false, //是否在每次请求结束时强制保存会话，即使会话没有被修改
      saveUninitialized: false, //是否在会话未被初始化时保存会话
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, //会话的过期时间，单位是毫秒
      },
    })
  );
  app.use((req, res, next) => {
    req.user = { name: "jack", role: "admin" };
    next();
  });
  // app.useGlobalFilters(new CustomExceptionFilterUseClass());
  app.useGlobalPipe(new ValidationPipe());
  app.useGlobalInterceptors(new Logging4Interceptor());
  await app.listen(3000);
}

bootstrap();
