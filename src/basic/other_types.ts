// 特殊类型

// any
// 绕过类型检查（慎用）

{
  let data: any = { a: 1, b: "test" };
}
// void
// 表示无返回值

{
  function log(): void { console.log("done"); }
}
// never
// 永远不会出现的值（用于抛出错误或无限循环）

{
  function error(msg: string): never { throw new Error(msg); }
}
// unknown
// 类型安全的 any替代（需类型断言）

{
  // let input: unknown = getInput(); if (typeof input === "string") {}
}