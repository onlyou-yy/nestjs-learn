import { from, mergeMap, Observable, of, tap } from "rxjs";

const next = {
  handle() {
    console.log("pay...");
    return of("pay");
  },
};

class Logging1Interceptor {
  intercept(_, next) {
    console.log("before1...");
    return next.handle().pipe(
      tap(() => {
        console.log("after1...");
      })
    );
  }
}

class Logging2Interceptor {
  async intercept(_, next) {
    console.log("before2...");
    return next.handle().pipe(
      tap(() => {
        console.log("after2...");
      })
    );
  }
}

function executeInterceptors(interceptors) {
  let currentHandler = () => next.handle();
  interceptors.forEach((interceptor) => {
    const previousHandler = currentHandler;
    currentHandler = () =>
      interceptor.intercept(null, { handle: previousHandler });
  });
  return currentHandler();
}

const log1 = new Logging1Interceptor();
const log2 = new Logging2Interceptor();

// executeInterceptors([log1, log2]).subscribe(console.log);

console.log("-".repeat(20));

/**
 * nestjs 中拦截器的基本实现
 */

async function routeHandler() {
  console.log("enter router");
  return "route handle";
}

function callInterceptors(interceptors) {
  const nextFn = (i = 0): Observable<any> => {
    // 2.当执行完拦截器再执行路由处理函数
    if (i >= interceptors.length) {
      const result: any = routeHandler();
      // 如果结果 promise （路由处理是异步的），就使用 from，否则用 of
      return result instanceof Promise ? from(result) : of(result);
    }
    // 1.先执行拦截器
    const result = interceptors[i].intercept(null, {
      handle: () => nextFn(i + 1),
    });
    return from(result).pipe(
      mergeMap((val) => (val instanceof Observable ? val : of(val)))
    );
  };
  return nextFn();
}

callInterceptors([log2, log1]).subscribe((value) => {
  console.log("value", value);
});
