import { Controller, Get } from "@nestjs/common";

// 负责处理传入 HTTP 请求的核心组件，每个控制器负责处理特定的请求路径和对呀的http方法
// 在控制器的内部会使用路由装饰器 @Get @Post 来定义路径的请求处理方法
@Controller("test")
export class AppController {
  @Get("/hello")
  getHello(): string {
    return "Hello World!";
  }
}
