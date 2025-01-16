import { Controller, Get, Inject } from "@nestjs/common";
import {
  FactoryService,
  LoggerClassService,
  LoggerService,
  UserLoggerService,
} from "./logger.service";

@Controller()
export class AppController {
  constructor(
    private loggerClassService: LoggerClassService,
    private loggerService: LoggerService,
    @Inject("UserLog") private userLog: UserLoggerService,
    @Inject("FactoryLog") private factoryLog: FactoryService
  ) {}

  @Get()
  index() {
    this.loggerClassService.log("call index");
    this.loggerService.log("call index");
    this.userLog.log("call index");
    this.factoryLog.log("call index");
    return "index";
  }
}
