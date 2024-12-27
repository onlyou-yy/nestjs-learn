import { Controller, Get, Req, Request } from "@nestjs/common";
import { ExpressRequest, ExpressResponse } from "@nestjs/core/types";

@Controller("user")
export class UserController {
  @Get("req")
  handleRequest(
    @Req() req: ExpressRequest,
    @Request() request: ExpressRequest
  ) {
    console.log("req.url", req.url);
    console.log("req.path", req.path);
    console.log("req.method", req.method);
    console.log("request.url", request.url);
    console.log("request.path", request.path);
    console.log("request.method", request.method);
    return "user handleRequest";
  }
}
