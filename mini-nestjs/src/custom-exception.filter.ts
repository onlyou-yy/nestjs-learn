import { BadRequestException, Catch } from "@nestjs/common";
import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from "express";
import { LoggerService } from "./logger.service";

// 只捕获处理 BadRequestException 的异常 （用在类或全局）
@Catch(BadRequestException)
export class CustomExceptionFilterUseClass implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: `class:${JSON.stringify(exception.getResponse())}`,
      timestamp: new Date().toLocaleDateString(),
      path: request.originalUrl,
    });
  }
}

// 只捕获处理 BadRequestException 的异常 (用在方法)
@Catch(BadRequestException)
export class CustomExceptionFilterUseMethod implements ExceptionFilter {
  constructor(private logger?: LoggerService) {}
  catch(exception: any, host: ArgumentsHost) {
    this.logger?.log("CustomExceptionFilterUseMethod logger");
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: `method:${JSON.stringify(exception.getResponse())}`,
      timestamp: new Date().toLocaleDateString(),
      path: request.originalUrl,
    });
  }
}
