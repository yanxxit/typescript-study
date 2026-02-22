// 一、类型断言（Type Assertion）

// 1. as关键字语法 基本，推荐使用
// 特点：

// - 兼容 JSX，推荐在所有场景使用
// - 可读性强，语法直观
// - 适用场景：
// DOM 元素类型指定
// - 第三方库返回值类型覆盖
// - 联合类型分支处理

{
  let a: any = 'hello'
  let b = a as string
  console.log("a as string=", b) // hello


  let ro: any = [1, 2, 3, 4];

  let ro2 = (ro as number[])
  ro2.push(5)
  console.log("ro as number[]=", ro2)

  // 双重断言（Double Assertion）
  let c: any = 123
  let d = c as any as number
  console.log("c as any as number=", d)
  const value = '42' as unknown as number;
  console.log("value=", value)
}
// - 允许跨类型断言
// 绕过直接类型不兼容限制

// 2. 尖括号语法 <Type>

// 特点：
// - 早期语法，与 JSX 标签冲突
// - 编译后会被移除
// 适用场景：
// - 非 JSX 代码的快速断言
// - 简单表达式类型覆盖

{
  let someValue: any = "this is a string";
  const length = (<string>someValue).length;
}


// 二、类型注解（Type Annotation）

{
  let name: string = "Alice";
  const age: number = 30;
}

// 六、as const断言
// 特点：
// 将字面量类型固定为不可变
// 生成最精确的只读类型
// 适用场景：
// 配置对象类型锁定
// 需要精确类型推断的场景

{
  const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000
  } as const;

  console.log("config=", config, typeof config)
  // 类型推断为：
  // {
  //   readonly apiUrl: "https://api.example.com";
  //   readonly timeout: 5000;
  // }
}
