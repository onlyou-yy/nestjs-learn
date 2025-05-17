import {
  BadRequestException,
  Controller,
  Get,
  UseInterceptors,
} from "@nestjs/common";
import {
  CacheInterceptor,
  ErrorInterceptor,
  Logging1Interceptor,
  Logging2Interceptor,
  Logging3Interceptor,
  TimeoutInterceptor,
  TransformInterceptor,
} from "./logger1.interceptor";
import { Query } from "@nestjs/common";

@Controller("pay")
@UseInterceptors(Logging3Interceptor)
export class PayController {
  constructor() {}

  @Get()
  @UseInterceptors(Logging1Interceptor)
  @UseInterceptors(Logging2Interceptor)
  index() {
    console.log("pay...");
    return "in pay";
  }

  @Get("data")
  @UseInterceptors(TransformInterceptor)
  data() {
    console.log("data...");
    return "transform data";
  }

  @Get("error")
  @UseInterceptors(ErrorInterceptor)
  error() {
    console.log("error...");
    throw new BadRequestException("interceptor error test");
  }

  @Get("cache")
  @UseInterceptors(CacheInterceptor)
  cache(@Query("id") id: string) {
    console.log("cache...");
    return `get id ${id}`;
  }

  @Get("timeout")
  @UseInterceptors(TimeoutInterceptor)
  async timeout() {
    console.log("timeout...");
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
    return `timeout`;
  }
}
