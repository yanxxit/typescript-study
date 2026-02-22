// Function Types 函数类型

import { start } from "repl";

// 1. 参数与返回值类型

{
  // 函数声明
  function add(a: number, b: number): number {
    return a + b;
  }

  // 函数表达式
  const multiply = (x: number, y: number): number => x * y;

  console.log(add(2, 3)); // 输出：5
  console.log(multiply(2, 3)); // 输出：6
}

// 2. 可选参数与默认参数

{
  function greet(name: string, age?: number): void {
    console.log(`Hello ${name}, age: ${age || "unknown"}`);
  }
  greet("Alice"); // 输出：Hello Alice, age: unknown
  greet("Bob", 30); // 输出：Hello Bob, age: 30
}

// 3. 重载（Overloads）?
{
  // function add(a: number, b: number): number;
  // function add(a: string, b: string): string;
  function add(a: any, b: any): any {
    if (typeof a === "string" || typeof b === "string") {
      return `${a}${b}`;
    } else {
      return a + b;
    }
  }

  console.log(add(2, 3)); // 输出：5
  console.log(add("Hello", "World")); // 输出："HelloWorld"
}

// 4. 函数类型别名

{
  type BinaryFunction = (a: number, b: number) => number;

  const subtract: BinaryFunction = (x, y) => x - y;

  console.log("函数类型别名:", subtract(5, 3)); // 输出：2
}

// 5. 可调用签名

{
  interface Counter {
    (start: number): void;
  }

  const counter: Counter = (start) => console.log(`Counting from ${start}`);

  const counter2: Counter = (start) => {
    for (let i = start; i < 10; i++) {
      console.log(i);
    }
  }

  counter(10); // 输出：Counting from 10

  counter2(5); // 输出：5,6,7,8,9 (依次递增)
}

// 6. 泛型函数

{
  function identity<T>(arg: T): T {
    return arg;
  }

  console.log(identity("hello")); // 输出："hello"
  console.log(identity(123)); // 输出：123
}

// 7. 泛型约束

{
  interface Lengthwise {
    length: number;
  }

  function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // 现在我们知道 arg 有 length 属性，所以不会报错
    return arg;
  }

  loggingIdentity({ length: 10, value: 3 }); // 输出：10
}

// 8. 泛型类

{
  class GenericNumber<T> {
    zeroValue!: T;
    add!: (x: T, y: T) => T;
  }

  let myGenericNumber = new GenericNumber<number>();
  myGenericNumber.zeroValue = 0;
  myGenericNumber.add = function (x, y) {
    return x + y;
  };
}

{
  class GenericClass<T> {
    constructor(public value: T) { }
  }

  const instance = new GenericClass("Hello");
  console.log(instance.value); // 输出："Hello"
}

// 9. 泛型接口

{
  interface GenericIdentityFn<T> {
    (arg: T): T;
  }

  function identity<T>(arg: T): T {
    return arg;
  }

  let myIdentity: GenericIdentityFn<number> = identity;
  console.log(myIdentity(123)); // 输出：123
}

// 10. 泛型类与接口

{
  interface GenericClass<T> {
    value: T;
  }

  class MyGenericClass<U> implements GenericClass<U> {
    constructor(public value: U) { }
  }

  const instance = new MyGenericClass("Hello");
  console.log(instance.value); // 输出："Hello"
}

// 11. 泛型工厂函数

{
  function create<T>(c: { new(): T }): T {
    return new c();
  }

  class BeeKeeper { }
  class Zoo {
    beekeeper: BeeKeeper = create(BeeKeeper);
  }

  const zoo = new Zoo();
  console.log("泛型工厂函数 => Zoo:", zoo.beekeeper); // 输出：Zoo: BeeKeeper {}
}


// 12. Promise<string>

{
  function fetchData(name: string): Promise<string> {
    return new Promise((resolve) => resolve("Hello World = " + name));
  }

  fetchData('Promise<string>').then(data => console.log(data)); // 输出："Hello World"

  async function main(){
    let val = await fetchData('Promise<T>');
    console.log(val); // 输出："Hello World"
  }
  main();
}

// 13. Promise<T>
{
  function fetchData<T>(name: string): Promise<T> {
    return new Promise((resolve) => resolve("Hello World = " + name as T));
  }

  fetchData('Promise<T>').then(data => console.log(data)); // 输出："Hello World"
}