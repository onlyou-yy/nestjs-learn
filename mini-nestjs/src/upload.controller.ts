import {
  FileSizeValidationPipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from "@nestjs/common";
import { Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("upload")
export class UploadController {
  constructor() {}

  @Post()
  // 获取 请求体中字段为 file 的文件数据
  // 并将转化后的文件保存到 req.file 上
  @UseInterceptors(FileInterceptor("file"))
  file(@UploadedFile() file: Express.Multer.File) {
    console.log("upload...", file);
    return "upload success";
  }

  @Post("max1MB")
  @UseInterceptors(FileInterceptor("file"))
  fileMax1MB(@UploadedFile(FileSizeValidationPipe) file: Express.Multer.File) {
    console.log("upload...", file);
    return "upload success";
  }

  @Post("parse")
  @UseInterceptors(FileInterceptor("file"))
  parse(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 }),
          new FileTypeValidator({ fileType: "image/png" }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    console.log("upload...", file);
    return "upload success";
  }
}
