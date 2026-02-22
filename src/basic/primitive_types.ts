// 一、基础类型（Primitive Types）

// number
// 表示数字（整数、浮点数、科学计数法）
{
  const age: number = 31;
  const price: number = 9.99;
}

// string
// 表示文本数据，支持单引号、双引号、模板字符串

{
  const name: string = "Alice";
  const message = `Hello ${name}`;
}

// boolean
// 仅有 true和 false两个值

{
  let isActive: boolean = true;
}

// null/undefined
// 表示空值或未定义，TypeScript 中默认是所有类型的子类型（需开启严格模式）

{
  let data: null = null;
  let error: undefined = undefined;
}

// symbol
// 创建唯一标识符（常用于对象属性键）

{
  const KEY: symbol = Symbol("unique_key");
}

// bigint
// 表示任意精度整数（用于大数计算）

{
  const bigNum: bigint = BigInt(12345678901234567890);
  console.log(bigNum);

  const bigNum1: bigint = 12345678901234567890n;
  console.log(bigNum1);
}