import { SetMetadata } from "@nestjs/common";
import "reflect-metadata";

export class Reflector {
  get(metadataKey, target: any, key?: any) {
    return key
      ? Reflect.getMetadata(metadataKey, target, key)
      : Reflect.getMetadata(metadataKey, target);
  }
  static createDecorator<T = any>() {
    function decoratorFactory(metadataValue: T) {
      return SetMetadata(decoratorFactory, metadataValue);
    }
    return decoratorFactory;
  }
}
