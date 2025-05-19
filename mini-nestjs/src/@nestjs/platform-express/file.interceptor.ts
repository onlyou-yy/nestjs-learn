import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import multer from "multer";
export function FileInterceptor(fieldName: string) {
  @Injectable()
  class FileInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      // 当需要处理单个字段的当个文件上传的时候可以使用 single(fieldName)得到一个 express 中间件函数
      const upload = multer().single(fieldName);
      await new Promise<void>((resolve, reject) => {
        upload(request, response, (err) => {
          err ? reject(err) : resolve();
        });
      });

      return next.handle();
    }
  }

  return new FileInterceptor();
}
