import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { Logging1Interceptor } from "./logger1.interceptor";

@Controller("pay")
export class PayController {
  constructor() {}

  @Get()
  @UseInterceptors(Logging1Interceptor)
  index() {
    console.log("pay...");
    return "in pay";
  }
}
