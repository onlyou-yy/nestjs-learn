import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";

export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata?: ArgumentMetadata) {
    // 最大1M
    const maxSize = 1024 * 1024;
    if (value.size > maxSize) {
      throw new BadRequestException("File size is too large.");
    }
    return value;
  }
}
