# TypeScript 类型断言与类型推断完全指南

> 类型断言（Type Assertions）和类型推断（Type Inference）是 TypeScript 类型系统的两大支柱。断言让你告诉编译器"我知道自己在做什么"，推断让编译器自动推导类型。

## 目录

1. [类型断言概述](#1-类型断言概述)
2. [as 语法](#2-as-语法)
3. [尖括号语法](#3-尖括号语法)
4. [as const 断言](#4-as-const-断言)
5. [非空断言（!）](#5-非空断言)
6. [类型断言的限制](#6-类型断言的限制)
7. [类型推断概述](#7-类型推断概述)
8. [类型推断规则](#8-类型推断规则)
9. [infer 关键字](#9-infer-关键字)
10. [实战案例](#10-实战案例)

---

## 1. 类型断言概述

类型断言告诉编译器"我比你更了解这个值的类型"。

```typescript
let value: unknown = 'hello'
let length = (value as string).length  // ❌ 编译器不知道 value 是 string
// 使用断言后：✅
```

### 适用场景

| 场景 | 说明 |
|------|------|
| DOM 操作 | `document.getElementById('app') as HTMLDivElement` |
| API 响应 | `response.json() as User` |
| 联合类型 | 缩窄类型范围 |
| 第三方库 | 处理类型不完整的库 |

---

## 2. as 语法

推荐使用，兼容 JSX。

```typescript
// 基本用法
let a: any = 'hello'
let b = a as string
console.log(b.toUpperCase())  // ✅

// 联合类型缩窄
function process(value: string | number) {
  if (typeof value === 'string') {
    return (value as string).toUpperCase()  // 已经是 string，断言可省略
  }
  return value.toFixed(2)
}

// DOM 操作
const div = document.getElementById('app') as HTMLDivElement
div.style.color = 'red'
```

### 与类型注解的区别

```typescript
// 类型注解：编译器检查
let a: string = 'hello'  // ✅ 编译器验证类型

// 类型断言：绕过检查
let b: any = 'hello'
let c = b as string  // ✅ 不检查，直接信任

// 类型注解 vs 类型断言
let x: string = 'hello'    // 类型注解（编译时检查）
let y = 'hello' as string  // 类型断言（不检查）
```

---

## 3. 尖括号语法

早期语法，与 JSX 冲突，不推荐。

```typescript
let someValue: any = 'this is a string'

// 尖括号语法
let length = (<string>someValue).length

// 等同于 as 语法
let length2 = (someValue as string).length

// 在 JSX/TSX 文件中，尖括号语法会报错：
// <string>someValue  // ❌ 与 JSX 标签冲突
```

---

## 4. as const 断言

将字面量类型固定为最精确的只读类型。

### 基本用法

```typescript
// 没有 as const
const config1 = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
}
// 类型：{ apiUrl: string; timeout: number }

// 使用 as const
const config2 = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const
// 类型：{ readonly apiUrl: 'https://api.example.com'; readonly timeout: 5000 }
```

### 数组的 as const

```typescript
// 没有 as const
const arr1 = ['a', 'b', 'c']
// 类型：string[]

// 使用 as const
const arr2 = ['a', 'b', 'c'] as const
// 类型：readonly ['a', 'b', 'c']
```

### 配合枚举使用

```typescript
// as const 替代简单枚举
const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  DELETED: 'deleted'
} as const

type Status = typeof STATUS[keyof typeof STATUS]
// 'pending' | 'active' | 'deleted'
```

---

## 5. 非空断言（!）

告诉编译器值不是 `null` 或 `undefined`。

```typescript
// 可能为 null
function getLength(value: string | null): number {
  // return value.length  // ❌ 编译器报错
  return value!.length  // ✅ 使用非空断言
}

// DOM 操作
const element = document.getElementById('app')!
element.style.color = 'red'  // 不会报错

// 可选属性
interface User {
  name: string
  address?: {
    city: string
  }
}

function getCity(user: User): string {
  return user.address!.city  // 假设 address 一定存在
}
```

### 注意事项

```typescript
// ⚠️ 非空断言不会在运行时检查
let value: string | null = null
console.log(value!.length)  // ❌ 运行时错误！

// 更安全的写法
function process(value: string | null): string {
  if (value === null) {
    return 'default'
  }
  return value.length.toString()  // ✅ 编译器自动缩窄
}
```

---

## 6. 类型断言的限制

### 不允许任意类型间断言

```typescript
// ❌ 错误：类型不兼容
let num: number = 42
let str = num as string  // ❌ 报错

// ✅ 使用 unknown 中转
let str2 = num as unknown as string  // 双重断言
```

### 不允许具体类型断言为联合类型

```typescript
// ❌ 错误
let str: string = 'hello'
let union = str as string | number  // 报错

// ✅ 可以从联合类型断言为具体类型
let value: string | number = 'hello'
let str2 = value as string  // ✅
```

---

## 7. 类型推断概述

TypeScript 自动推导变量、返回值、参数的类型。

```typescript
// 变量推断
let name = 'Alice'  // 推断为 string
let age = 30         // 推断为 number
let active = true    // 推断为 boolean

// 函数返回值推断
function add(a: number, b: number) {
  return a + b  // 返回类型推断为 number
}

// 回调参数推断
const numbers = [1, 2, 3]
numbers.map(x => x * 2)  // x 推断为 number
```

---

## 8. 类型推断规则

### 变量初始化

```typescript
let x = 42           // number
let y = 'hello'      // string
let z = true         // boolean
let arr = [1, 2, 3]  // number[]
```

### 最佳通用类型

```typescript
let arr = [1, 'hello', true]
// 推断为 (number | string | boolean)[]

let obj = { x: 1, y: 'hello' }
// 推断为 { x: number; y: string }
```

### 上下文类型推断

```typescript
// 回调参数推断
const numbers = [1, 2, 3]
numbers.map(x => x * 2)  // x 自动推断为 number

// 事件处理
element.addEventListener('click', (event) => {
  // event 自动推断为 MouseEvent
})
```

### 返回类型推断

```typescript
// 显式返回类型
function add(a: number, b: number): number {
  return a + b
}

// 隐式返回类型（推荐）
function add(a: number, b: number) {
  return a + b  // 自动推断为 number
}
```

---

## 9. infer 关键字

在条件类型中推断类型。

### 基本用法

```typescript
// 推断函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Fn = () => string
type Result = ReturnType<Fn>  // string
```

### 推断 Promise 内部类型

```typescript
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T

type A = UnwrapPromise<Promise<string>>           // string
type B = UnwrapPromise<Promise<Promise<number>>>  // number（递归解包）
type C = UnwrapPromise<string>                     // string（不是 Promise，直接返回）
```

### 推断函数参数类型

```typescript
type FirstArg<T> = T extends (first: infer F, ...args: any[]) => any ? F : never

type A = FirstArg<(name: string, age: number) => void>  // string
```

### 推断元组类型

```typescript
type Head<T> = T extends [infer H, ...any[]] ? H : never
type Tail<T> = T extends [any, ...infer R] ? R : never

type A = Head<[1, 2, 3]>  // 1
type B = Tail<[1, 2, 3]>  // [2, 3]
```

### 递归推断

```typescript
type DeepUnwrap<T> = T extends Promise<infer R> ? DeepUnwrap<R> : T

type A = DeepUnwrap<Promise<Promise<Promise<string>>>>
// string
```

---

## 10. 实战案例

### 案例 1：DOM 操作

```typescript
function getElementById(id: string): HTMLElement {
  const element = document.getElementById(id)
  if (!element) {
    throw new Error(`元素 ${id} 不存在`)
  }
  return element  // 类型缩窄，无需断言
}

const div = getElementById('app')
div.style.color = 'red'  // ✅ HTMLElement 类型

// 如果确定类型，使用断言
const input = document.getElementById('myInput') as HTMLInputElement
input.value = 'hello'
```

### 案例 2：API 响应处理

```typescript
interface User {
  id: number
  name: string
  email: string
}

// 不推荐：使用断言
async function fetchUser1(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  return response.json() as Promise<User>  // 不安全
}

// 推荐：使用类型守卫
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  )
}

async function fetchUser2(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const data = await response.json()
  if (!isUser(data)) {
    throw new Error('无效的用户数据')
  }
  return data  // 类型安全
}
```

### 案例 3：泛型工具函数

```typescript
// 使用 infer 推断类型
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T
type DeepUnwrap<T> = T extends Promise<infer R> ? DeepUnwrap<R> : T

// 使用示例
async function fetchData() {
  return { id: 1, name: 'Alice' }
}

type DataType = DeepUnwrap<ReturnType<typeof fetchData>>
// { id: number; name: string }
```

### 案例 4：as const 模拟枚举

```typescript
// 使用 as const 替代枚举
const Directions = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
} as const

type Direction = typeof Directions[keyof typeof Directions]
// 'up' | 'down' | 'left' | 'right'

// 使用
function move(direction: Direction) {
  console.log(`向${direction}移动`)
}

move(Directions.UP)  // ✅ 自动补全
move('up')           // ✅ 也支持字符串
```

---

## 小结

| 概念 | 语法 | 用途 |
|------|------|------|
| 类型断言 | `x as Type` | 告诉编译器类型 |
| 尖括号断言 | `<Type>x` | 早期语法（不推荐） |
| as const | `x as const` | 固定字面量类型 |
| 非空断言 | `x!` | 排除 null/undefined |
| 类型推断 | 自动 | 编译器推导类型 |
| infer | `infer T` | 条件类型中推断 |

**最佳实践**：
- 优先使用类型推断，避免不必要的断言
- 使用 `as` 而不是尖括号语法
- 使用 `as const` 替代简单枚举
- 谨慎使用非空断言，优先用类型守卫
- 使用 `infer` 在条件类型中推断类型
- 避免双重断言（`as unknown as X`）
