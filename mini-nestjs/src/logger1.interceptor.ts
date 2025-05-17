import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  // CallHandler,
} from "@nestjs/common";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, tap, timeout } from "rxjs/operators";
import { LoggerService } from "./logger.service";
import { BadRequestException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class Logging1Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next): Observable<any> {
    console.log("Before1...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After1... ${Date.now() - now}ms`)));
  }
}

@Injectable()
export class Logging2Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next): Observable<any> {
    console.log("Before2...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After2... ${Date.now() - now}ms`)));
  }
}

@Injectable()
export class Logging3Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next): Observable<any> {
    console.log("Before3...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After3... ${Date.now() - now}ms`)));
  }
}

@Injectable()
export class Logging4Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next): Observable<any> {
    console.log("Before4...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After4... ${Date.now() - now}ms`)));
  }
}

@Injectable()
export class Logging5Interceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}
  intercept(context: ExecutionContext, next): Observable<any> {
    this.logger.log("Logging5Interceptor");
    console.log("Before5...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After5... ${Date.now() - now}ms`)));
  }
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next): Observable<any> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError((err) =>
          throwError(() => new BadRequestException(err.message))
        )
      );
  }
}

const cacheMap = new Map();
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const id = request.query.id;
    if (cacheMap.has(id)) {
      return of(cacheMap.get(id));
    }
    return next.handle().pipe(
      tap((val) => {
        cacheMap.set(id, `cache: ${val}`);
      })
    );
  }
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next): Observable<any> {
    return next.handle().pipe(
      timeout(2000),
      catchError((err) =>
        throwError(() => new BadRequestException(err.message))
      )
    );
  }
}
