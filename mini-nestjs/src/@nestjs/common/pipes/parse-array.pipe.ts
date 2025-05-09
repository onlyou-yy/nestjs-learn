import { BadRequestException, PipeTransform } from "@nestjs/common";

interface IParseArrayPipeOptions {
  items: any;
  separator?: string;
}

export class ParseArrayPipe implements PipeTransform<string, Array<any>> {
  constructor(private readonly options: IParseArrayPipeOptions) {}
  transform(value: string): Array<any> {
    if (!value) {
      return [];
    }
    const { items = String, separator = "," } = this.options ?? {};
    return value.split(separator).map((item) => {
      if (items === String) {
        return item;
      } else if (items === Number) {
        return Number(item);
      }
    });
  }
}
