import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      const responseData = exception.getResponse();
      const status = exception.getStatus();
      if (typeof responseData === "string") {
        response.status(status).json({
          statusCode: status,
          message: responseData,
        });
      } else {
        response.status(status).json(responseData);
      }
    } else {
      response.status(500).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      });
    }
  }
}
