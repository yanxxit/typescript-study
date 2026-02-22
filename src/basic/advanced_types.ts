// Advanced Types 高级类型

// 联合类型（Union Types）
// 多类型兼容：number | string

{
  let value: number | string = 10;
  value = "hello";
  console.log('多类型兼容：number | string = ', value);
}

// 2. 交叉类型（Intersection Types）
// 合并多个类型：
{
  interface A { a: number }
  interface B { b: string }
  type AB = A & B;
  let obj: AB = { a: 1, b: "test" };

  console.log(obj);
}

// 3. 类型别名（Type Alias）
// 简化复杂类型：

{
  type StringOrNumber = string | number;
  type Point = { x: number; y: number };

  let value: StringOrNumber = 10;
  value = "hello";

  console.log(value);
  let point: Point = { x: 1, y: 2 };

  console.log(point);
}