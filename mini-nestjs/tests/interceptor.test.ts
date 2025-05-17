import { of, tap } from "rxjs";

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
  intercept(_, next) {
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

executeInterceptors([log1, log2]).subscribe(console.log);
