import {
  ArgumentMetadata,
  BadRequestException,
  FileValidator,
  PipeTransform,
} from "@nestjs/common";

export interface ParseFileOptions {
  validators?: FileValidator[];
}

export class ParseFilePipe implements PipeTransform {
  constructor(private options: ParseFileOptions = {}) {}
  async transform(value: any, metadata?: ArgumentMetadata) {
    // 输入的文件为空
    if (!value) {
      throw new BadRequestException("no file submit");
    }
    if (this.options.validators) {
      for (const validator of this.options.validators) {
        await validator.isValid(value);
      }
    }
    return value;
  }
}
