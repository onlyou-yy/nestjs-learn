import { BadRequestException } from "@nestjs/common";
import { FileValidator } from "./file-validator";

export class MaxFileSizeValidator extends FileValidator {
  isValid(file?: any): boolean | Promise<boolean> {
    if (file.size > this.validationOptions.maxSize) {
      throw new BadRequestException(
        `file size limit ${this.validationOptions.maxSize}`
      );
    }
    return true;
  }
}
