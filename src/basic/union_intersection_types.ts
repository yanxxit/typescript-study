// 联合类型（Union Types）和交叉类型（Intersection Types）

// 一、联合类型（Union Types）的典型场景
// 1. 处理多类型输入
// 场景：函数参数、API 响应或配置项需要支持多种类型。
// 应用价值：避免使用 any类型，增强类型安全性。
{
  // 处理不同格式的输入（字符串/数字）
  function padLeft(value: string, padding: string | number): string {
    if (typeof padding === "number") {
      return " ".repeat(padding) + value;
    }
    return padding + value;
  }

  console.log(padLeft("Hello world", 4)); // "    Hello world"
  console.log(padLeft("Hello world", "* ")); // "* Hello world"
}

// 2. API 响应处理
// 场景：统一处理成功、错误、加载中等状态。
// 关键点：通过 status字段区分类型，结合类型守卫确保安全性。

{
  type ApiResponse<T> =
    | { status: "success"; data: T }
    | { status: "error"; message: string }
    | { status: "loading" };

  interface User {
    id: number;
    name: string;
  }

  function handleResponse(response: ApiResponse<User[]>) {
    switch (response.status) {
      case "success": console.log(response.data); break;
      case "error": console.error(response.message); break;
      default: console.log("Loading...");
    }
  }

  handleResponse({ status: "success", data: [{ id: 1, name: "Alice" }] });

  handleResponse({ status: "error", message: "Failed to load data" });

  handleResponse({ status: "loading" });
}

// 3. 可辨识联合（Discriminated Union）
// 场景：通过共享字面量属性区分不同类型。
// 优势：避免冗长的 if-else判断，提升代码可读性。

{
  // 圆形和正方形共用 kind属性区分类型。
  interface Circle { kind: "circle"; radius: number }
  // 正方形
  interface Square { kind: "square"; sideLength: number }
  // 形状
  type Shape = Circle | Square;

  function getArea(shape: Shape) {
    switch (shape.kind) {
      case "circle": return Math.PI * shape.radius ** 2;
      case "square": return shape.sideLength ** 2;
    }
  }

  console.log(getArea({ kind: "circle", radius: 2 })); // 12.566370614359172
}

// 4. 第三方库类型扩展
// 场景：为现有类型添加自定义属性。
// 实现方式：通过交叉类型合并原有类型与扩展类型。

declare module "axios" {
  interface AxiosRequestConfig {
    retryCount?: number; // 扩展配置项
  }
}
{
  // import axios from "axios";
  // const response = await axio÷s.get("/api/data", { retryCount: 3 });
}


// 二、交叉类型（Intersection Types）的典型场景


// 1. 组合接口属性
// 场景：合并多个接口的属性，避免重复定义。
// 应用价值：复用已有类型，减少冗余代码。

{
  interface Person { name: string; age: number }
  interface Employee { company: string; salary: number }
  // 组合接口属性
  type EmployeePerson = Person & Employee;

  const employee: EmployeePerson = {
    name: "Alice",
    age: 30,
    company: "Tech Corp",
    salary: 100000
  };

  console.log("组合接口属性=", employee);
}

// 2. 混合功能模块
// 场景：对象需要同时满足多个角色的功能。
// 优势：实现多接口的灵活组合。
{
  interface Drivable { drive(): void }
  interface Flyable { fly(): void }
  // 混合功能模块
  type FlyingCar = Drivable & Flyable;

  class TeslaCybertruck implements FlyingCar {
    drive() { /* 驾驶逻辑 */
      console.log("Driving...");
    }
    fly() { /* 飞行逻辑 */
      console.log("Flying...");
    }
  }

  const myCar = new TeslaCybertruck();
  myCar.drive();
  myCar.fly();
}

// 3. 动态配置合并
// 场景：合并基础配置与动态扩展配置。
// 关键点：通过交叉类型实现配置的灵活扩展。

{
  type BaseConfig = { timeout: number; retries: number }
  type WebConfig = BaseConfig & { device: "web" }
  type MobileConfig = BaseConfig & { device: "mobile" }

  function init(config: WebConfig | MobileConfig) {
    console.log(config.timeout, config.device);
  }
  init({ timeout: 1000, retries: 3, device: "web" });
  init({ timeout: 500, retries: 2, device: "mobile" });
}

// 4. 第三方库类型增强
// 场景：为第三方库的类型添加自定义方法。
// 实现方式：交叉类型扩展第三方库的接口定义。

interface Lodash {
  chunk<T>(array: T[], size: number): T[][];
}
// declare global {
//   interface Window {
//     _: Lodash & { customMethod: () => void };
//   }
// }


// 三、联合类型与交叉类型的组合应用

// 1. 条件类型与类型转换
// 场景：根据条件动态生成类型。

{
  type ExtractString<T> = T extends string ? T : never;
  type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

  type Example = UnionToIntersection<{ a: string } | { b: number }>;

  // 示例：将联合类型转换为交叉类型
  type Result = UnionToIntersection<Example>;

  // 类型推断：{ a: string } & { b: number }

  // 结果：{ a: string } & { b: number }
}

// 2. 表单系统设计
// 场景：处理动态表单字段的类型安全。

{
  type FieldType = "text" | "number";
  interface BaseField { id: string; label: string }
  interface TextField extends BaseField { type: "text"; maxLength?: number }
  interface NumberField extends BaseField { type: "number"; min?: number }

  type FormField = TextField | NumberField;

  function createForm(fields: FormField[]) {
    // 类型安全处理表单字段
  }
}