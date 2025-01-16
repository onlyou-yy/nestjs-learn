import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class LoggerClassService {
  log(msg: string) {
    console.log("LoggerClassService", msg);
  }
}

@Injectable()
export class LoggerService {
  constructor(@Inject("SUFFIX") private suffix: string) {}
  log(msg: string) {
    console.log(`LoggerService.${this.suffix}`, msg);
  }
}

@Injectable()
export class UserLoggerService {
  log(msg: string) {
    console.log("UserLoggerService" + msg);
  }
}

@Injectable()
export class FactoryService {
  constructor(private prefix: string, private suffix: string) {}
  log(msg: string) {
    console.log(`FactoryService:${this.prefix}.${this.suffix}`, msg);
  }
}
