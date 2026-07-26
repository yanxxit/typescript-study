# TypeScript 类型推断完全指南

> 类型推断（Type Inference）是 TypeScript 的核心特性，让编译器自动推导变量、函数参数和返回值的类型，减少显式类型注解的需要。

## 目录

1. [什么是类型推断](#1-什么是类型推断)
2. [变量推断](#2-变量推断)
3. [函数推断](#3-函数推断)
4. [上下文类型推断](#4-上下文类型推断)
5. [最佳通用类型](#5-最佳通用类型)
6. [泛型推断](#6-泛型推断)
7. [infer 关键字](#7-infer-关键字)
8. [推断控制](#8-推断控制)
9. [实战案例](#9-实战案例)

---

## 1. 什么是类型推断

类型推断是 TypeScript 编译器根据代码上下文自动推导类型的能力。

```typescript
// 没有显式类型注解
let x = 42          // 推断为 number
let y = 'hello'     // 推断为 string
let z = true        // 推断为 boolean

// 等同于
let x: number = 42
let y: string = 'hello'
let z: boolean = true
```

---

## 2. 变量推断

### 初始化推断

```typescript
// 基本类型推断
let a = 42           // number
let b = 'hello'      // string
let c = true         // boolean
let d = null         // null
let e = undefined    // undefined

// 对象推断
let obj = { name: 'Alice', age: 30 }
// 推断为 { name: string; age: number }

// 数组推断
let arr = [1, 2, 3]  // number[]
let mixed = [1, 'hello']  // (number | string)[]
```

### 最佳通用类型

```typescript
// 多种类型时，选择最佳通用类型
let arr = [1, 'hello', true]
// 推断为 (number | string | boolean)[]

// 对象合并
let obj = { x: 1, y: 'hello' }
// 推断为 { x: number; y: string }
```

---

## 3. 函数推断

### 返回类型推断

```typescript
// TypeScript 自动推断返回类型
function add(a: number, b: number) {
  return a + b  // 返回类型推断为 number
}

// 箭头函数
const multiply = (a: number, b: number) => a * b  // 返回 number
```

### 参数类型推断

```typescript
// 回调参数类型推断
const numbers = [1, 2, 3]
numbers.map(x => x * 2)  // x 自动推断为 number

// 对象方法
const obj = {
  name: 'Alice',
  greet() {
    return `Hello, ${this.name}`  // this.name 推断为 string
  }
}
```

### 重载函数推断

```typescript
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

format('hello')  // string
format(3.14)     // string
```

---

## 4. 上下文类型推断

TypeScript 根据使用位置推断类型。

### 回调参数推断

```typescript
const numbers = [1, 2, 3]
numbers.map(x => x * 2)  // x 自动推断为 number

// 事件处理
element.addEventListener('click', (event) => {
  // event 自动推断为 MouseEvent
})
```

### 赋值推断

```typescript
interface Point {
  x: number
  y: number
}

const point: Point = { x: 1, y: 2 }  // 类型注解
const point2 = { x: 1, y: 2 }        // 自动推断
```

### 对象字面量推断

```typescript
interface Config {
  host: string
  port: number
  debug?: boolean
}

// 上下文推断
const config: Config = {
  host: 'localhost',
  port: 3000
  // debug 是可选的，不需要提供
}
```

---

## 5. 最佳通用类型

TypeScript 在多种类型中选择最佳通用类型。

### 数组的通用类型

```typescript
// 数字数组
let a = [1, 2, 3]  // number[]

// 混合类型
let b = [1, 'hello']  // (number | string)[]

// 对象数组
let c = [{ x: 1 }, { y: 2 }]
// { x: number }[] | { y: number }[]
```

### 对象的通用类型

```typescript
// 合并对象类型
let obj = { x: 1, y: 'hello', z: true }
// 推断为 { x: number; y: string; z: boolean }
```

---

## 6. 泛型推断

### 基本泛型推断

```typescript
function identity<T>(value: T): T {
  return value
}

// 自动推断 T
const result = identity('hello')  // T 推断为 string
const num = identity(42)          // T 推断为 number
```

### 泛型约束推断

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }
getProperty(user, 'name')  // K 推断为 'name'，返回 string
getProperty(user, 'age')   // K 推断为 'age'，返回 number
```

### 多参数泛型推断

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second]
}

const result = pair('hello', 42)  // [string, number]
```

---

## 7. infer 关键字

在条件类型中声明待推断的类型变量。

### 推断函数返回类型

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Fn = () => string
type Result = ReturnType<Fn>  // string
```

### 推断 Promise 类型

```typescript
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T

type A = UnwrapPromise<Promise<string>>           // string
type B = UnwrapPromise<Promise<Promise<number>>>  // number
```

### 推断元组类型

```typescript
type Head<T> = T extends [infer H, ...any[]] ? H : never
type Tail<T> = T extends [any, ...infer R] ? R : never

type A = Head<[1, 2, 3]>  // 1
type B = Tail<[1, 2, 3]>  // [2, 3]
```

---

## 8. 推断控制

### 显式类型注解

```typescript
// 当推断不准确时，使用显式注解
let value: string | number = 42  // 显式指定类型
```

### as const

```typescript
// 固定字面量类型
const config = {
  host: 'localhost',
  port: 3000
} as const
// 类型：{ readonly host: 'localhost'; readonly port: 3000 }
```

### NoInfer

```typescript
// 阻止类型推断传播
function create<T extends string>(colors: T[], defaultColor?: NoInfer<T>) {}

create(['red', 'yellow'], 'red')  // ✅
// create(['red', 'yellow'], 'blue')  // ❌
```

---

## 9. 实战案例

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
  // K 自动推断，data 类型安全
}

on('click', (data) => {
  console.log(data.x, data.y)  // 类型安全
})
```

### 案例 2：类型安全的 API

```typescript
interface ApiEndpoints {
  '/users': { id: number; name: string }
  '/posts': { id: number; title: string }
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
    credentials: { username: string; password: string }
  }
}

type PartialConfig = DeepPartial<Config>
// 所有属性（包括嵌套）都变为可选
```

---

## 小结

| 推断场景 | 说明 |
|----------|------|
| 变量初始化 | 根据初始值推断类型 |
| 函数返回值 | 根据 return 语句推断 |
| 回调参数 | 根据上下文推断参数类型 |
| 泛型参数 | 根据使用位置推断泛型 |
| infer | 在条件类型中推断类型 |

**最佳实践**：
- 优先使用类型推断，减少显式注解
- 当推断不准确时，使用显式类型注解
- 使用 `as const` 固定字面量类型
- 使用 `NoInfer` 阻止不必要的推断
- 保持代码可读性
