import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { LoggerService } from "./logger.service";

@Injectable()
export class GlobalPipe implements PipeTransform {
  constructor(private logger?: LoggerService) {}
  transform(value: any, metadata?: ArgumentMetadata) {
    this.logger?.log("GlobalPipe logger");
    return value;
  }
}
