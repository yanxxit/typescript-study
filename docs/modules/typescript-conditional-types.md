# TypeScript 条件类型完全指南

> 条件类型（Conditional Types）是 TypeScript 类型系统的强大特性，允许根据条件选择不同的类型。它是实现高级类型工具的基础。

## 目录

1. [什么是条件类型](#1-什么是条件类型)
2. [基本语法](#2-基本语法)
3. [infer 关键字](#3-infer-关键字)
4. [分布式条件类型](#4-分布式条件类型)
5. [内置条件类型](#5-内置条件类型)
6. [高级模式](#6-高级模式)
7. [实战案例](#7-实战案例)

---

## 1. 什么是条件类型

条件类型根据类型关系选择不同的类型，类似于 JavaScript 的三元运算符。

```typescript
// 基本条件类型
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
```

---

## 2. 基本语法

### 语法结构

```typescript
type ConditionalType = T extends U ? X : Y
// 如果 T 可以赋值给 U，结果为 X，否则为 Y
```

### 实际示例

```typescript
// 检查是否为数组
type IsArray<T> = T extends any[] ? true : false

type A = IsArray<string[]>  // true
type B = IsArray<number>    // false

// 检查是否为函数
type IsFunction<T> = T extends (...args: any[]) => any ? true : false

type C = IsFunction<() => void>  // true
type D = IsFunction<string>      // false
```

### 条件类型的嵌套

```typescript
type TypeName<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  T extends undefined ? 'undefined' :
  T extends Function ? 'function' :
  'object'

type A = TypeName<string>   // 'string'
type B = TypeName<() => void>  // 'function'
```

---

## 3. infer 关键字

`infer` 用于在条件类型中**声明待推断的类型变量**。

### 基本用法

```typescript
// 推断函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Fn = () => string
type Result = ReturnType<Fn>  // string

// 推断函数参数类型
type FirstArg<T> = T extends (first: infer F, ...args: any[]) => any ? F : never

type A = FirstArg<(name: string, age: number) => void>  // string
```

### 推断 Promise 内部类型

```typescript
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T

type A = UnwrapPromise<Promise<string>>           // string
type B = UnwrapPromise<Promise<Promise<number>>>  // number
type C = UnwrapPromise<string>                     // string
```

### 推断元组类型

```typescript
// 推断第一个元素
type Head<T> = T extends [infer H, ...any[]] ? H : never

// 推断剩余元素
type Tail<T> = T extends [any, ...infer R] ? R : never

type A = Head<[1, 2, 3]>  // 1
type B = Tail<[1, 2, 3]>  // [2, 3]
```

### 推断对象属性

```typescript
// 推断对象的值类型
type ValueOf<T> = T[keyof T]

// 推断数组元素类型
type ElementOf<T> = T extends (infer E)[] ? E : never

type A = ElementOf<string[]>  // string
type B = ElementOf<number[]>  // number
```

### 递归推断

```typescript
// 递归解包 Promise
type DeepUnwrap<T> = T extends Promise<infer R> ? DeepUnwrap<R> : T

type A = DeepUnwrap<Promise<Promise<Promise<string>>>>
// string
```

---

## 4. 分布式条件类型

当条件类型作用于联合类型时，会**分发**到每个成员。

### 分布式行为

```typescript
type ToArray<T> = T extends any ? T[] : never

type StrOrNum = string | number
type Result = ToArray<StrOrNum>
// string[] | number[]（分发到每个成员）
```

### 非分布式行为

```typescript
// 使用元组包装，避免分发
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never

type StrOrNum = string | number
type Result = ToArrayNonDist<StrOrNum>
// (string | number)[]（不分发）
```

### never 的特殊行为

```typescript
// never 是空联合类型，分发后结果为 never
type ToArray<T> = T extends any ? T[] : never
type Result = ToArray<never>  // never
```

---

## 5. 内置条件类型

### Exclude\<UnionType, ExcludedMembers\>

```typescript
type T0 = Exclude<'a' | 'b' | 'c', 'a'>  // 'b' | 'c'
```

### Extract\<Type, Union\>

```typescript
type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>  // 'a'
```

### NonNullable\<Type\>

```typescript
type T0 = NonNullable<string | number | undefined>  // string | number
```

### ReturnType\<Type\>

```typescript
type T0 = ReturnType<() => string>  // string
```

### Parameters\<Type\>

```typescript
type T0 = Parameters<(name: string, age: number) => void>  // [string, number]
```

### Awaited\<Type\>

```typescript
type T0 = Awaited<Promise<string>>           // string
type T1 = Awaited<Promise<Promise<number>>>  // number
```

---

## 6. 高级模式

### 条件类型与映射类型结合

```typescript
// 将函数类型包装为 Promise
type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[K]
}

interface Api {
  getUser(id: number): User
  getPost(id: number): Post
}

type AsyncApi = Promisify<Api>
// {
//   getUser(id: number): Promise<User>
//   getPost(id: number): Promise<Post>
// }
```

### 条件类型与模板字面量

```typescript
// 将字符串转换为事件名
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<'click'>  // 'onClick'

// 检查字符串是否以特定前缀开头
type StartsWith<T extends string, Prefix extends string> =
  T extends `${Prefix}${string}` ? true : false

type A = StartsWith<'onClick', 'on'>  // true
type B = StartsWith<'click', 'on'>    // false
```

### 条件类型与 infer 结合

```typescript
// 提取 Promise 返回类型
type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : T extends (...args: any[]) => infer R
    ? R
    : never

async function fetchData() { return { id: 1 } }
type Result = AsyncReturnType<typeof fetchData>  // { id: number }
```

---

## 7. 实战案例

### 案例 1：类型安全的事件系统

```typescript
type EventMap = {
  click: { x: number; y: number }
  keydown: { key: string }
  resize: { width: number; height: number }
}

type EventKey = keyof EventMap
type EventData<K extends EventKey> = EventMap[K]

function on<K extends EventKey>(
  event: K,
  handler: (data: EventData<K>) => void
) {
  // 类型安全的事件处理
}

on('click', (data) => {
  console.log(data.x, data.y)  // 类型安全
})
```

### 案例 2：类型安全的 API 客户端

```typescript
interface ApiEndpoints {
  '/users': { id: number; name: string }
  '/posts': { id: number; title: string }
  '/comments': { id: number; body: string }
}

type Endpoint = keyof ApiEndpoints
type Response<T extends Endpoint> = ApiEndpoints[T]

async function fetchApi<T extends Endpoint>(
  endpoint: T
): Promise<Response<T>> {
  const response = await fetch(endpoint)
  return response.json()
}

const user = await fetchApi('/users')  // { id: number; name: string }
```

### 案例 3：深度 Partial

```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K]
}

interface Config {
  db: {
    host: string
    port: number
    credentials: {
      username: string
      password: string
    }
  }
  cache: {
    ttl: number
  }
}

type PartialConfig = DeepPartial<Config>
// 所有属性（包括嵌套）都变为可选
```

---

## 小结

| 特性 | 语法 | 说明 |
|------|------|------|
| 基本条件 | `T extends U ? X : Y` | 类型层面的三元运算 |
| infer | `infer T` | 推断类型变量 |
| 分布式 | 联合类型自动分发 | 分发到每个成员 |
| 非分布式 | `[T] extends [any]` | 包装为元组避免分发 |

**最佳实践**：
- 使用 `infer` 在条件类型中推断类型
- 注意分布式条件类型的行为
- 使用 `[T] extends [any]` 避免不必要的分发
- 结合映射类型和模板字面量类型创建强大的工具
