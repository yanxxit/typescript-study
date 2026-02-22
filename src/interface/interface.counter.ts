interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = <Counter>function (start: number) {
    console.log("start=", start);
  };
  counter.interval = 123;
  counter.reset = function () {
    // 重置计数器
    console.log("reset");
    counter.interval = 0;
  };
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;

console.log("接口也可以实现调用签名 = ", c);