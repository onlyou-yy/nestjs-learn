import { ArgumentMetadata } from "@nestjs/common";

export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata?: ArgumentMetadata): R;
}
