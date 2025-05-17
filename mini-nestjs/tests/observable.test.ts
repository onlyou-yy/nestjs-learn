class Observable {
  constructor(private _subscribe) {}
  // 订阅方法，接收一个观察者对象
  subscribe(observer) {
    return this._subscribe(
      typeof observer === "function"
        ? { next: observer, error: () => {}, complete: () => {} }
        : observer
    );
  }
  // 管道方法，接收多个操作符，并依次执行它们
  pipe(operator) {
    return operator(this);
  }
}

function of(...values) {
  return new Observable((observer) => {
    values.forEach((value) => observer.next(value));
    observer.complete?.();
  });
}

function from(input) {
  return new Observable((observer) => {
    if (input instanceof Promise) {
      input.then(
        (value) => {
          observer.next(value);
          observer.complete?.();
        },
        (error) => {
          observer.error?.(error);
        }
      );
    } else {
      for (let value of input) {
        observer.next(value);
      }
      observer.complete?.();
    }
  });
}

function mergeMap(project) {
  // 返回一个可接收原可观察对象的函数
  return function (source) {
    // 返回一个新的可观察对象
    return new Observable((observer) => {
      source.subscribe({
        next: (value) => {
          // 得到新的内部可观察对象
          const innerObservable = project(value);
          // 订阅内部可观察对象
          innerObservable.subscribe({
            next: (innerValue) => observer.next(innerValue),
          });
        },
      });
    });
  };
}

of(1, 2, 3).subscribe({
  next: console.log,
  complete: () => console.log("of complete"),
});

from([1, 2, 3]).subscribe({
  next: console.log,
  complete: () => console.log("from arr complete"),
});

from(Promise.resolve(2)).subscribe({
  next: console.log,
  complete: () => console.log("from promise complete"),
});

of(1, 2, 3)
  .pipe(mergeMap((value) => of(value * 2)))
  .subscribe({
    next: console.log,
    complete: () => console.log("mergeMap complete"),
  });
