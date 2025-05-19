import { BadRequestException } from "@nestjs/common";
import { FileValidator } from "./file-validator";
export class FileTypeValidator extends FileValidator {
  isValid(file?: any): boolean | Promise<boolean> {
    if (file.mimetype !== this.validationOptions.fileType) {
      throw new BadRequestException(
        `文件类型:${this.validationOptions.fileType}不支持`
      );
    }
    return true;
  }
}
