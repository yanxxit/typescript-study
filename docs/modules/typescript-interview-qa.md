# TypeScript 面试常见考点

> 整理 TypeScript 面试中最常见的问题及最佳答案，帮助你系统性地准备面试。

---

## 基础概念

### Q1: TypeScript 是什么？它与 JavaScript 有什么区别？

**A:** TypeScript 是 JavaScript 的超集，在 JavaScript 基础上添加了**静态类型系统**。

| 特性 | JavaScript | TypeScript |
|------|------------|------------|
| 类型检查 | 运行时 | 编译时 |
| 类型注解 | ❌ | ✅ |
| 接口 | ❌ | ✅ |
| 枚举 | ❌ | ✅ |
| 泛型 | ❌ | ✅ |
| 编译 | 不需要 | 编译为 JS |

```typescript
// JavaScript：运行时才发现错误
function add(a, b) { return a + b }
add(1, '2')  // 不报错，运行时可能出问题

// TypeScript：编译时就能发现错误
function add(a: number, b: number): number { return a + b }
add(1, '2')  // ❌ 编译错误
```

---

### Q2: 什么是类型推断？TypeScript 如何推断类型？

**A:** 类型推断是 TypeScript 编译器根据代码上下文自动推导类型的能力。

```typescript
// 变量推断
let x = 42          // 推断为 number
let y = 'hello'     // 推断为 string

// 函数返回值推断
function add(a: number, b: number) {
  return a + b  // 返回类型自动推断为 number
}

// 回调参数推断
const numbers = [1, 2, 3]
numbers.map(x => x * 2)  // x 自动推断为 number
```

---

### Q3: `any` 和 `unknown` 有什么区别？

**A:**

| 特性 | any | unknown |
|------|-----|---------|
| 类型安全 | ❌ 绕过检查 | ✅ 需要检查 |
| 赋值 | 可以赋值给任何类型 | 只能赋值给 unknown |
| 使用 | 不需要类型检查 | 必须先检查类型 |

```typescript
// any：不安全
let a: any = 'hello'
a.foo()  // ✅ 不报错，但运行时出错

// unknown：安全
let b: unknown = 'hello'
// b.foo()  // ❌ 编译错误
if (typeof b === 'string') {
  b.toUpperCase()  // ✅ 检查后使用
}
```

---

### Q4: `never` 和 `void` 有什么区别？

**A:**

| 特性 | never | void |
|------|-------|------|
| 含义 | 永远不会出现 | 无返回值 |
| 使用场景 | 抛出错误、无限循环 | 无返回值的函数 |

```typescript
// never：永远不会返回
function throwError(): never {
  throw new Error('error')
}

function infiniteLoop(): never {
  while (true) {}
}

// void：无返回值
function log(message: string): void {
  console.log(message)
}
```

---

## 接口与类型

### Q5: interface 和 type 有什么区别？

**A:**

| 特性 | interface | type |
|------|-----------|------|
| 对象结构 | ✅ | ✅ |
| 联合类型 | ❌ | ✅ |
| 交叉类型 | ✅（extends） | ✅（&） |
| 元组 | ❌ | ✅ |
| 映射类型 | ❌ | ✅ |
| 声明合并 | ✅ | ❌ |
| 被类实现 | ✅ | ❌ |

```typescript
// interface：定义对象结构
interface User {
  id: number
  name: string
}

// type：更灵活
type ID = string | number
type Point = [number, number]
type Status = 'active' | 'inactive'
```

---

### Q6: 什么是声明合并？

**A:** 同名的接口会自动合并。

```typescript
interface User {
  name: string
}

interface User {
  age: number
}

// 合并后：User { name: string; age: number }
const user: User = { name: 'Alice', age: 30 }
```

**常见用途**：扩展第三方库的类型。

```typescript
// 扩展 Express 的 Request
declare module 'express' {
  interface Request {
    user?: { id: number; name: string }
  }
}
```

---

## 泛型

### Q7: 什么是泛型？为什么需要泛型？

**A:** 泛型允许创建可复用的组件，支持多种类型。

```typescript
// 没有泛型：需要为每种类型写函数
function identityString(value: string): string { return value }
function identityNumber(value: number): number { return value }

// 有泛型：一个函数适用所有类型
function identity<T>(value: T): T { return value }

identity('hello')  // string
identity(42)       // number
```

---

### Q8: 如何约束泛型？

**A:** 使用 `extends` 关键字。

```typescript
// 约束 T 必须有 length 属性
function logLength<T extends { length: number }>(value: T): T {
  console.log(value.length)
  return value
}

logLength('hello')     // ✅ string 有 length
logLength([1, 2, 3])   // ✅ array 有 length
// logLength(42)       // ❌ number 没有 length

// keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }
getProperty(user, 'name')  // ✅ string
// getProperty(user, 'email')  // ❌ 'email' 不在 keyof User 中
```

---

### Q9: 泛型默认值是什么？

**A:** 为泛型参数提供默认类型。

```typescript
interface ApiResponse<T = any> {
  code: number
  data: T
}

// 使用默认类型
const response: ApiResponse = {
  code: 200,
  data: { anything: true }  // data 是 any
}

// 指定具体类型
const userResponse: ApiResponse<User> = {
  code: 200,
  data: { id: 1, name: 'Alice' }  // data 必须是 User
}
```

---

## 类型守卫

### Q10: 什么是类型守卫？有哪几种？

**A:** 类型守卫在运行时检查类型，缩窄类型范围。

| 类型 | 语法 | 适用场景 |
|------|------|----------|
| typeof | `typeof x === 'string'` | 原始类型 |
| instanceof | `x instanceof Class` | 类实例 |
| in | `'prop' in obj` | 属性存在性 |
| 自定义 | `x is Type` | 复杂类型 |

```typescript
// typeof
function format(value: string | number): string {
  if (typeof value === 'string') return value.toUpperCase()
  return value.toFixed(2)
}

// 自定义类型守卫
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase())  // string
  }
}
```

---

## 泛型高级

### Q11: 什么是 infer 关键字？

**A:** `infer` 用于在条件类型中声明待推断的类型变量。

```typescript
// 推断函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Fn = () => string
type Result = ReturnType<Fn>  // string

// 推断 Promise 内部类型
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T

type A = UnwrapPromise<Promise<string>>  // string
type B = UnwrapPromise<Promise<Promise<number>>>  // number

// 推断元组类型
type Head<T> = T extends [infer H, ...any[]] ? H : never
type Tail<T> = T extends [any, ...infer R] ? R : never

type A = Head<[1, 2, 3]>  // 1
type B = Tail<[1, 2, 3]>  // [2, 3]
```

---

### Q12: 什么是条件类型？

**A:** 条件类型根据类型关系选择不同的类型。

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never
type Result = ToArray<string | number>  // string[] | number[]
```

---

### Q13: 什么是映射类型？

**A:** 映射类型遍历对象类型的每个键，创建新类型。

```typescript
// Partial: 所有属性可选
type Partial<T> = { [K in keyof T]?: T[K] }

// Readonly: 所有属性只读
type Readonly<T> = { readonly [K in keyof T]: T[K] }

// Pick: 选取指定键
type Pick<T, K extends keyof T> = { [P in K]: T[P] }

// Record: 构造键值映射
type Record<K extends keyof any, T> = { [P in K]: T }

// 使用
interface User { id: number; name: string }
type PartialUser = Partial<User>  // { id?: number; name?: string }
```

---

## 工具类型

### Q14: 常用的内置工具类型有哪些？

**A:**

| 类型 | 作用 | 示例 |
|------|------|------|
| `Partial<T>` | 所有属性可选 | `Partial<User>` |
| `Required<T>` | 所有属性必选 | `Required<Config>` |
| `Readonly<T>` | 所有属性只读 | `Readonly<User>` |
| `Pick<T, K>` | 选取指定键 | `Pick<User, 'name'>` |
| `Omit<T, K>` | 排除指定键 | `Omit<User, 'id'>` |
| `Record<K, V>` | 构造键值映射 | `Record<string, number>` |
| `Exclude<T, U>` | 排除联合成员 | `Exclude<'a'\|'b', 'a'>` |
| `Extract<T, U>` | 提取联合成员 | `Extract<'a'\|'b', 'a'>` |
| `NonNullable<T>` | 排除 null/undefined | `NonNullable<string\|null>` |
| `ReturnType<T>` | 提取返回类型 | `ReturnType<typeof fn>` |
| `Parameters<T>` | 提取参数类型 | `Parameters<typeof fn>` |
| `Awaited<T>` | 解包 Promise | `Awaited<Promise<string>>` |

---

## 异步

### Q15: async/await 和 Promise 有什么区别？

**A:** async/await 是 Promise 的语法糖，让异步代码更易读。

```typescript
// Promise 链
fetch('/api/user')
  .then(res => res.json())
  .then(user => {
    console.log(user)
  })
  .catch(error => {
    console.error(error)
  })

// async/await
async function getUser() {
  try {
    const res = await fetch('/api/user')
    const user = await res.json()
    console.log(user)
  } catch (error) {
    console.error(error)
  }
}
```

---

### Q16: 如何处理多个并行的异步操作？

**A:** 使用 `Promise.all`。

```typescript
// 串行（慢）
const user = await fetchUser(1)
const posts = await fetchPosts(1)

// 并行（快）
const [user, posts] = await Promise.all([
  fetchUser(1),
  fetchPosts(1)
])

// 部分失败不影响其他
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
])

results.forEach((result, index) => {
  if (result.status === 'rejected') {
    console.log(`用户 ${index} 失败:`, result.reason)
  }
})
```

---

## 类与面向对象

### Q17: TypeScript 中的访问修饰符有哪些？

**A:**

| 修饰符 | 类内部 | 子类 | 类外部 |
|--------|--------|------|--------|
| `public` | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ❌ |
| `private` | ✅ | ❌ | ❌ |

```typescript
class User {
  public name: string      // 公开（默认）
  private age: number      // 私有
  protected email: string  // 受保护

  constructor(name: string, age: number, email: string) {
    this.name = name
    this.age = age
    this.email = email
  }
}

class Employee extends User {
  greet() {
    return `Hello, ${this.name}`   // ✅ public
    // return this.age             // ❌ private
    return this.email              // ✅ protected
  }
}
```

---

### Q18: 抽象类和接口有什么区别？

**A:**

| 特性 | 抽象类 | 接口 |
|------|--------|------|
| 实现方法 | ✅ | ❌ |
| 构造函数 | ✅ | ❌ |
| 属性 | ✅ | ✅ |
| 多继承 | ❌ | ✅ |
| 运行时 | 存在 | 不存在 |

```typescript
// 抽象类：可以有实现
abstract class Shape {
  color: string
  constructor(color: string) { this.color = color }
  abstract area(): number  // 抽象方法
  describe() { return `面积: ${this.area()}` }  // 普通方法
}

// 接口：只有声明
interface Printable {
  print(): void
}
```

---

## 模块与声明

### Q19: ES 模块和 CommonJS 有什么区别？

**A:**

| 特性 | ES 模块 | CommonJS |
|------|---------|----------|
| 语法 | `import/export` | `require/module.exports` |
| 加载 | 异步 | 同步 |
| 浏览器 | ✅ 原生支持 | 需要打包工具 |
| Node.js | 支持（需配置） | 默认支持 |

```typescript
// ES 模块
import { add } from './math'
export function add(a: number, b: number) { return a + b }

// CommonJS（编译后）
const { add } = require('./math')
module.exports = { add }
```

---

### Q20: 什么是声明文件（.d.ts）？

**A:** 声明文件只包含类型声明，不包含实现，用于为 JS 库添加类型。

```typescript
// types/my-lib.d.ts
declare module 'my-lib' {
  export function doSomething(): void
  export const version: string
}

// 为全局变量声明类型
declare const APP_NAME: string
declare function debug(message: string): void
```

---

## 高级类型

### Q21: 什么是映射类型？

**A:** 映射类型遍历对象类型的每个键，创建新类型。

```typescript
interface User { id: number; name: string; email: string }

// Partial: 所有属性可选
type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string }

// Pick: 选取指定键
type UserName = Pick<User, 'name' | 'email'>
// { name: string; email: string }

// Omit: 排除指定键
type UserWithoutId = Omit<User, 'id'>
// { name: string; email: string }
```

---

### Q22: 什么是条件类型？

**A:** 条件类型根据类型关系选择不同的类型。

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false

// 实际应用
type ArrayOrSingle<T> = T extends any[] ? T : T[]
type Result = ArrayOrSingle<number>  // number[]
```

---

### Q23: 什么是 infer？

**A:** `infer` 用于在条件类型中推断类型。

```typescript
// 推断函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Fn = () => string
type Result = ReturnType<Fn>  // string

// 推断 Promise 内部类型
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T

type A = UnwrapPromise<Promise<string>>  // string
```

---

## 实际场景

### Q24: 如何处理 API 响应的类型安全？

**A:**

```typescript
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

interface User {
  id: number
  name: string
}

// 类型安全的 API 调用
async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url)
  return response.json()
}

const user = await fetchApi<User>('/api/user/1')
console.log(user.data.name)  // 类型安全
```

---

### Q25: 如何实现类型安全的事件系统？

**A:**

```typescript
type EventMap = {
  click: { x: number; y: number }
  keydown: { key: string }
  resize: { width: number; height: number }
}

function on<K extends keyof EventMap>(
  event: K,
  handler: (data: EventMap[K]) => void
) {
  // 类型安全
}

on('click', (data) => {
  console.log(data.x, data.y)  // 类型安全
})
```

---

### Q26: 如何处理联合类型？

**A:** 使用类型守卫。

```typescript
type Result = 
  | { success: true; data: any }
  | { success: false; error: string }

function handleResult(result: Result) {
  if (result.success) {
    console.log(result.data)  // data 存在
  } else {
    console.log(result.error)  // error 存在
  }
}
```

---

### Q27: 如何实现泛型缓存？

**A:**

```typescript
class Cache<K, V> {
  private store = new Map<K, V>()

  set(key: K, value: V): void {
    this.store.set(key, value)
  }

  get(key: K): V | undefined {
    return this.store.get(key)
  }

  has(key: K): boolean {
    return this.store.has(key)
  }
}

const userCache = new Cache<string, User>()
userCache.set('user:1', { id: 1, name: 'Alice' })
const user = userCache.get('user:1')  // 类型安全
```

---

### Q28: 如何实现类型安全的路由？

**A:**

```typescript
interface Routes {
  '/users': { id: number; name: string }
  '/posts': { id: number; title: string }
}

type Route = keyof Routes

async function fetchData<T extends Route>(route: T): Promise<Routes[T]> {
  const response = await fetch(route)
  return response.json()
}

const user = await fetchData('/users')  // { id: number; name: string }
```

---

### Q29: 如何处理可空类型？

**A:**

```typescript
// 使用类型守卫
function process(value: string | null): string {
  if (value !== null) {
    return value.toUpperCase()  // string
  }
  return 'default'
}

// 使用非空断言（谨慎）
function process2(value: string | null): string {
  return value!.toUpperCase()  // 不安全
}

// 更安全的写法
function process3(value: string | null): string {
  return value?.toUpperCase() ?? 'default'
}
```

---

### Q30: 如何实现 Result 模式？

**A:**

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

function Err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

// 使用
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Err('除数不能为零')
  return Ok(a / b)
}

const result = divide(10, 2)
if (result.ok) {
  console.log(result.value)  // number
} else {
  console.log(result.error)  // string
}
```

---

## 速查表

### 面试高频考点

| 考点 | 频率 | 核心答案 |
|------|------|----------|
| interface vs type | ⭐⭐⭐⭐⭐ | interface 支持声明合并，type 更灵活 |
| any vs unknown | ⭐⭐⭐⭐⭐ | unknown 更安全，需要类型检查 |
| 泛型 | ⭐⭐⭐⭐⭐ | 类型参数化，提高复用性 |
| 类型守卫 | ⭐⭐⭐⭐⭐ | 运行时类型检查，缩窄类型 |
| async/await | ⭐⭐⭐⭐⭐ | Promise 的语法糖，更易读 |
| 工具类型 | ⭐⭐⭐⭐ | 内置类型变换工具 |
| 条件类型 | ⭐⭐⭐ | 类型层面的条件判断 |
| infer | ⭐⭐⭐ | 条件类型中的类型推断 |
| 映射类型 | ⭐⭐⭐ | 遍历键创建新类型 |
| 声明合并 | ⭐⭐ | 同名接口自动合并 |

---

## 面试技巧

### 回答框架

1. **定义**：先说清楚概念是什么
2. **语法**：给出基本语法示例
3. **场景**：说明什么时候使用
4. **对比**：与其他相关概念对比
5. **实践**：给出实际应用案例

### 常见追问

- "为什么？" → 解释原因和动机
- "有什么区别？" → 对比表格
- "怎么用？" → 代码示例
- "有什么坑？" → 注意事项
