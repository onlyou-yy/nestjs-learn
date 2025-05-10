import "reflect-metadata";
export function SetMetadata(key, value) {
  return (target, propertyKey?, descriptor?) => {
    if (descriptor) {
      Reflect.defineMetadata(key, value, descriptor.value);
    } else {
      Reflect.defineMetadata(key, value, target);
    }
  };
}
