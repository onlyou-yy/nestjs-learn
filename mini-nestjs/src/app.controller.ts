import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  UseFilters,
} from "@nestjs/common";
import {
  FactoryService,
  LoggerClassService,
  LoggerService,
  UserLoggerService,
} from "./logger.service";
import { CommonService } from "./common.service";
import { OtherService } from "./other.service";
import { AppService } from "./app.service";
import { HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { ForbiddenException } from "./forbidden.exception";
import {
  CustomExceptionFilterUseClass,
  CustomExceptionFilterUseMethod,
} from "./custom-exception.filter";

@Controller()
@UseFilters(new CustomExceptionFilterUseClass())
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

  @Get("exception")
  exception() {
    // 当异常是未识别的（既不是 HttpException 也不是继承自 HttpException 的类）
    // throw new Error("未识别"); // {statusCode:500,message:"Internal server error"}

    // throw new HttpException("Forbidden", HttpStatus.FORBIDDEN); // {statusCode:403,message:"Forbidden"}

    throw new HttpException(
      {
        errorCode: "E00001",
        status: HttpStatus.FORBIDDEN,
        error: "未授权",
      },
      HttpStatus.FORBIDDEN
    );
  }

  @Get("forbiddenException")
  forbiddenException() {
    throw new ForbiddenException();
  }

  @Get("customException1")
  customException1() {
    throw new BadRequestException("Bad Request", "from controller");
  }

  @Get("customException2")
  @UseFilters(new CustomExceptionFilterUseMethod())
  customException2() {
    throw new BadRequestException("Bad Request", "from method ins");
  }

  @Get("customException3")
  @UseFilters(CustomExceptionFilterUseMethod)
  customException3() {
    throw new BadRequestException("Bad Request", "from method class");
  }

  @Get("customException4")
  customException4() {
    throw new BadRequestException("Bad Request", "from global");
  }
}
