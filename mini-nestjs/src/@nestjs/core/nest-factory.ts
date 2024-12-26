import { Logger } from "./logger";
import { NestApplication } from "./nest-application";
import { ClassConstructor } from "./types";

export class NestFactory {
  static async create(module: ClassConstructor) {
    Logger.log("Starting Nest application...", "NestFactory");
    const app = new NestApplication(module);
    return app;
  }
}
