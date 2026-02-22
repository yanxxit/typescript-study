// Compound Types 复合类型


// 1. 数组类型
// 写法：number[]或 Array<number>
// 多类型数组：(number | string)[]

{
  let numbers: number[] = [1, 2, 3];
  let mixed: (number | string)[] = [1, "a", 3];
}

// 2. 元组（Tuple）
// 固定长度和类型：[number, string]

{
  let person: [number, string] = [30, "Bob"];

  let [age, name]: [number, string] = person;
  console.log(age, name);
}

// 3. 枚举（Enum）
// 数字枚举（默认自增）：

{
  enum Color { Red, Green = 2, Blue }

  let c: Color = Color.Green;
  console.log(c); // 输出：2
}

// 字符串枚举（需显式赋值）：

{
  enum Direction { Up = "UP", Down = "DOWN" }

  let d: Direction = Direction.Up;
  console.log(d); // 输出："UP"
}