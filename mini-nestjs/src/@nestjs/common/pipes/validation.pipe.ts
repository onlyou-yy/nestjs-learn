import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata?: ArgumentMetadata) {
    console.log("ValidationPipe");
    const classConstructor = metadata.metatype;
    if (!classConstructor || !this.needValidate(classConstructor)) {
      return value;
    }
    // value 是用户传过来的普通对象
    // 将普通对象转换成类实例，之后再进行校验
    const instance = plainToInstance(classConstructor, value);
    const errors = await validate(instance);
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }
    return instance;
  }
  private formatErrors(errors: ValidationError[]) {
    return errors
      .map((error) => {
        for (const property in error.constraints) {
          return `${error.property} - ${error.constraints[property]}`;
        }
      })
      .join(",");
  }
  private needValidate(metatype: Function): boolean {
    // 基础类型不需要进行校验
    const types: Function[] = [String, Number, Symbol, Array, Object, Boolean];
    return !types.includes(metatype);
  }
}
