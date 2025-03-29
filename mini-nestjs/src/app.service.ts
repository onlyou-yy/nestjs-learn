import { Inject, Injectable } from "@nestjs/common";
import { Config } from "./dynamicConfig.module";
@Injectable()
export class AppService {
  constructor(
    @Inject("PREFIX") private readonly prefix: string,
    @Inject("CONFIG") private readonly config: Config
  ) {}
  getConfig() {
    console.log(this.prefix, this.config);
    return this.prefix + this.config.apiKey;
  }
}
