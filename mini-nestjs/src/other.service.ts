import { Injectable } from "@nestjs/common";
import { CommonService } from "./common.service";

@Injectable()
export class OtherService {
  constructor(private commonService: CommonService) {}
  log(val) {
    this.commonService.log("in other service log");
    console.log("OtherService log", val);
  }
}
