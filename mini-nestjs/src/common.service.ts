import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonService {
  log(val) {
    console.log("CommonService log", val);
  }
}
