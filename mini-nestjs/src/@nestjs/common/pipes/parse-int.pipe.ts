import { ArgumentMetadata } from "@nestjs/common";
import { BadRequestException, PipeTransform } from "@nestjs/common";

export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata?: ArgumentMetadata): number {
    console.log(metadata);
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed (numeric string is expected)`
      );
    }
    return val;
  }
}
