// 以下是 TypeScript 中 typeof运算符的 核心作用和 典型应用场景的详细解析，结合类型系统特性与工程实践：
// 一、核心作用

// typeof在 TypeScript 中主要有 两种用途：
// 运行时类型检测（JavaScript 原生行为）
// 获取变量/值的运行时类型（如 "string"、"object"）。

{
  console.log(typeof 123); // "number"
  console.log(typeof "hello"); // "string"
  console.log(typeof true); // "boolean"
  console.log(typeof {}); // "object"
  console.log(typeof []); // "object"
  console.log(typeof null); // "object" (在 JavaScript 中，null 被认为是 object 类型)
  console.log(typeof undefined); // "undefined"
  console.log(typeof Symbol()); // "symbol"
  console.log(typeof function () {}); // "function"
  console.log(typeof class {}); // "function"
  console.log(typeof /regex/); // "object" (在 JavaScript 中，正则表达式被视为对象)
  console.log(typeof new Date()); // "object"
  console.log(typeof new Map()); // "object"
  console.log(typeof new Set()); // "object"
  console.log(typeof new WeakMap()); // "object"
  console.log(typeof new WeakSet()); // "object"
  console.log(typeof BigInt(123)); // "bigint"
  console.log(typeof Symbol.iterator); // "symbol"
  console.log(typeof Math); // "object"
  console.log(typeof JSON); // "object"
  console.log(typeof Reflect); // "object"
  console.log(typeof Promise); // "function"
  console.log(typeof Promise.resolve); // "function"

  console.log("-------------------------------------------");
}

// 类型上下文中的类型推导（TypeScript 扩展）
// 从已有变量/对象中提取类型信息，生成类型别名或约束。

{
  const user = { name: "Alice", age: 30 };
  type UserType = typeof user; // { name: string; age: number }

  let user1: UserType = { name: "Bob", age: 25 };
  user1.age = 26; // OK
  user1.name = "Charlie"; // OK
  console.log(user1);
  console.log("----------");

  type UserType1 = UserType | { id: number };
  let user2: UserType1 = { name: "Dave", age: 35, id: 1 };
  console.log(user2);

  type UserType2 = UserType | { print(): void };
  let user3: UserType2 = {
    name: "Eve",
    age: 40,
    print: () => console.log("Printing..."),
  };

  if ("print" in user3) {
    user3.print();
  }
  console.log(user3);
}

// 二、类型系统中的典型应用

// 1. 类型复用与推导
// 避免重复定义类型
// 从 API 响应、配置对象等提取类型，保持类型一致性。

{
  // 从 API 响应推导类型
  const apiResponse = { id: 1, data: "success" };
  type ApiResponse = typeof apiResponse; // { id: number; data: string }
}

// 函数返回值类型推导
// 结合 ReturnType工具类型获取函数返回类型。

{
  function getUser() {
    return { name: "Bob" };
  }
  type User = ReturnType<typeof getUser>; // { name: string }
}

// 2. 动态类型安全
// 对象属性校验
// 结合 keyof确保动态访问的属性存在。

{
  const config = { theme: "dark", fontSize: 14 };
  type ConfigKeys = keyof typeof config; // "theme" | "fontSize"

  function getConfigValue(key: ConfigKeys) {
    return config[key]; // 类型安全：仅允许 ConfigKeys 中的键
  }

  let v = getConfigValue("theme"); // OK
  console.log("v: ", v);
}

// 枚举值约束
// 将数组字面量转换为固定联合类型。

{
  const roles = ["admin" as const, "editor"] as const;
  type Role = typeof roles[number]; // "admin" | "editor"

  function hasRole(user: { role: Role }) {
    return roles.includes(user.role); // 类型安全：仅允许 "admin" 或 "editor"
  }

  let is_role = hasRole({ role: "admin" }); // OK
  console.log("is_role: ", is_role);
}

// 3. 类型守卫（Type Guards）
// 基本类型检查
// 在条件分支中缩小类型范围。

{
  function isString(value: unknown): value is string {
    return typeof value === "string";
  }

  const input: string | number = "hello";
  if (isString(input)) {
    console.log(input.toUpperCase()); // 类型收窄为 string
  }
}

// 4. 类与构造函数类型
// 获取类构造函数类型
// 用于工厂模式或依赖注入。

{
  class Dog {
    bark() {
      console.log("woof!");
    }
  }
  type DogClass = typeof Dog; // 获取构造函数类型

  function createAnimal(cls: DogClass) {
    return new cls(); // 可创建 Dog 实例
  }

  const myDog = createAnimal(Dog);
  myDog.bark();
}

// 三、与 keyof的组合应用
// 1. 映射类型生成

{
  interface User {
    id: number;
    name: string;
  }

  // 生成可选属性类型
  type PartialUser = {
    [K in keyof typeof user]?: typeof user[K]; // 注意：user 应为类型而非实例
  };
}

// 2. 动态访问安全

{
  const user = { id: 1, name: "Alice" };
  type UserKeys = keyof typeof user;

  function getValue<K extends UserKeys>(obj: typeof user, key: K) {
    return obj[key]; // 类型自动推断为 typeof user[K]
  }

  let name = getValue(user, "name"); // string
  console.log("name: ", name);
}

// 类实例与构造函数的区别

{
  class MyClass {}
  // type InstanceType = typeof new MyClass();  // 实例类型
  type ConstructorType = typeof MyClass; // 构造函数类型
}

// 五、实际项目场景示例

// 场景1：API 响应类型自动推导

{
  async function fetchData<T>(): Promise<T> {
    const response = await fetch("/api/data");
    return response.json() as T;
  }

  // 使用示例
  // const userData = await fetchData<typeof apiResponse>();
}

// 场景2：配置对象类型同步

{
  const appConfig = {
    env: "production",
    timeout: 5000,
    features: ["auth", "analytics"],
  } as const;

  type AppConfig = typeof appConfig;
  type Feature = AppConfig["features"][number]; // "auth" | "analytics"
}

// 场景3：类型安全的动态导入

{
  // const modules = {
  //   user: () => import("./user"),
  //   order: () => import("./order")
  // };

  // type ModuleKey = keyof typeof modules;

  // async function loadModule(key: ModuleKey) {
  //   return modules[key]();  // 类型安全：仅允许 "user" | "order"
  // }
}
