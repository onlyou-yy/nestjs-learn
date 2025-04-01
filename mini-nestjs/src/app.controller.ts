import { Controller, Get, Inject } from "@nestjs/common";
import {
  FactoryService,
  LoggerClassService,
  LoggerService,
  UserLoggerService,
} from "./logger.service";
import { CommonService } from "./common.service";
import { OtherService } from "./other.service";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    private loggerClassService: LoggerClassService,
    private loggerService: LoggerService,
    private commonService: CommonService,
    private otherService: OtherService,
    private appService: AppService,
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

  @Get("common")
  common() {
    this.commonService.log("hello");
    return "common";
  }

  @Get("other")
  other() {
    this.otherService.log("hello");
    return "other";
  }

  @Get("config")
  config() {
    console.log(this.appService.getConfig());
    return this.appService.getConfig();
  }

  @Get("middle")
  middle() {
    return "middle";
  }
}
