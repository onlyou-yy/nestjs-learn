import { Body, Header, HttpCode, Redirect, Res } from "@nestjs/common";
import {
  Controller,
  Get,
  Query,
  Req,
  Request,
  Headers,
  Session,
  IP,
  Params,
  Post,
  Next,
} from "@nestjs/common";
import { ExpressRequest, ExpressResponse } from "@nestjs/core/types";
import { NextFunction } from "express";
import { User } from "./user.decorator";

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
    return `request.path:${request.path}`;
  }
  @Get("query")
  handleQuery(@Query() query, @Query("id") id) {
    console.log("query", query);
    return `id:${id}`;
  }
  @Get("header")
  handleHeader(@Headers() header, @Headers("user-agent") type) {
    console.log("header", header);
    return `header user-agent:${type}`;
  }
  @Get("session")
  handleSession(@Session() session, @Session("pageview") pageview) {
    console.log("session", session);
    if (!session.pageview) session.pageview = 0;
    session.pageview++;
    return `pageview:${pageview}`;
  }
  @Get("ip")
  getUserIp(@IP() ip: string) {
    return `user ip:${ip}`;
  }
  @Get("/:username/info/:age")
  handleParams(
    @Params() params,
    @Params("username") username,
    @Params("age") age
  ) {
    console.log("params", params);
    return `user name:${username},age:${age}`;
  }
  /**
   * 在使用nestjs的时候,一般来说一个实体会定义两个类型,一个是dto,一个是interface (同时返回给前端显示的数据一般叫Vo)
   * dto 客户端向服务器提交的数据对象,比如说当用户注册的时候{用户名,密码}
   * 然后敷u器一般会回去这个dto,然后保存到数据库中,保存的时候可能还会加入一些默认值,比如时间戳,对密码的加密
   * 还有可以会过滤掉某些字段,比如注册的时候密码和确认密码,但是保存的时候只保存密码
   * 数据库里保存的数据类型一般回定义为一个interface
   * userDto{用户名,密码,确认密码}
   * userInterface{用户名,密码,创建时间,更新时间}
   * @param createUserDto
   * @returns
   */
  @Post("create")
  handleBody(@Body() createUserDto) {
    console.log("body", createUserDto);
    return `user name:${createUserDto.username},age:${createUserDto.age}`;
  }
  @Get("res")
  handleResponse(@Res() res: ExpressResponse) {
    console.log("response", res);
    res.status(200).json({
      code: 200,
      message: "success",
    });
  }
  @Get("resPass")
  handleResponsePass(@Res({ passThrough: true }) res: ExpressResponse) {
    console.log("response", res);
    return "resPass";
  }
  @Get("next")
  handleNext(@Next() next: NextFunction) {
    console.log("Next");
    next();
  }
  @Get("nextPass")
  handleNextPass(@Next({ passThrough: true }) next: NextFunction) {
    console.log("Next pass");
    return "resPass";
  }
  @Get("redirect")
  @Redirect("/user/ip", 302)
  handleRedirect(@Next({ passThrough: true }) next: NextFunction) {
    console.log("Next pass");
    return "resPass";
  }
  @Get("redirectRet")
  @Redirect("*", 302)
  handleRedirectRest(@Next({ passThrough: true }) next: NextFunction) {
    return { url: "https://www.baidu.com" };
  }
  @Post("statusCode")
  @HttpCode(201)
  handleStatus(@Res({ passThrough: true }) res) {
    return `status code:${res.statusCode}`;
  }
  @Get("resHeaders")
  @Header("k1", "v1")
  handleResHeaders() {
    return `headers`;
  }
  @Get("reqUser")
  handleReqUser(@User() user, @User("role") role) {
    return `role:${role} JSON.stringify(user):${JSON.stringify(user)}`;
  }
}
