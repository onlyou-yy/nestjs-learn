import { HttpStatus } from "./http-status.enum";

export class HttpException extends Error {
  private response: string | Object;
  private status: HttpStatus;
  constructor(response: string | Object, status: HttpStatus) {
    super();
    this.response = response;
    this.status = status;
  }
  getResponse() {
    return this.response;
  }
  getStatus() {
    return this.status;
  }
}

// nestjs中有很多预设的 错误处理过滤器 https://nest.nodejs.cn/exception-filters#%E5%86%85%E7%BD%AE-http-%E5%BC%82%E5%B8%B8
export class BadRequestException extends HttpException {
  constructor(message, error) {
    super(
      {
        message: message,
        error,
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
