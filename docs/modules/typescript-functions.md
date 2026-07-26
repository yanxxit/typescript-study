# TypeScript 函数（Functions）完全指南

> 函数是 TypeScript 程序的基本构建块。TypeScript 为函数添加了类型注解、参数约束、重载等特性，让函数更安全、更易维护。

## 目录

1. [函数声明](#1-函数声明)
2. [函数类型](#2-函数类型)
3. [可选参数](#3-可选参数)
4. [默认参数](#4-默认参数)
5. [剩余参数](#5-剩余参数)
6. [函数重载](#6-函数重载)
7. [this 参数](#7-this-参数)
8. [异步函数](#8-异步函数)
9. [高阶函数](#9-高阶函数)
10. [实战案例](#10-实战案例)

---

## 1. 函数声明

### 基本声明

```typescript
function add(a: number, b: number): number {
  return a + b
}
```

### 函数表达式

```typescript
const add = (a: number, b: number): number => a + b
```

### 箭头函数

```typescript
const add = (a: number, b: number): number => a + b

// 单行返回可省略 return 和大括号
const multiply = (a: number, b: number) => a * b

// 单参数可省略括号
const double = (x: number) => x * 2
```

---

## 2. 函数类型

### 类型注解

```typescript
function add(a: number, b: number): number {
  return a + b
}
```

### 函数类型别名

```typescript
type MathFn = (a: number, b: number) => number

const add: MathFn = (a, b) => a + b
const subtract: MathFn = (a, b) => a - b
```

### 接口定义函数

```typescript
interface MathOp {
  (a: number, b: number): number
}

const add: MathOp = (a, b) => a + b
```

### 返回类型推断

```typescript
function add(a: number, b: number) {
  return a + b  // 返回类型自动推断为 number
}
```

---

## 3. 可选参数

使用 `?` 标记可选参数。

```typescript
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}`
}

greet('Alice')           // 'Hello, Alice'
greet('Alice', 'Hi')     // 'Hi, Alice'
```

### 注意事项

```typescript
// ❌ 错误：可选参数必须在必选参数之后
function greet(greeting?: string, name: string) {}

// ✅ 正确
function greet(name: string, greeting?: string) {}
```

---

## 4. 默认参数

```typescript
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}`
}

greet('Alice')           // 'Hello, Alice'
greet('Alice', 'Hi')     // 'Hi, Alice'
```

### 默认值类型推断

```typescript
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value)
}

createArray(3, 'hello')  // string[]
createArray(3, 42)       // number[]
```

---

## 5. 剩余参数

使用 `...` 收集不定数量的参数。

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}

sum(1, 2, 3)        // 6
sum(1, 2, 3, 4, 5)  // 15
```

### 混合使用

```typescript
function log(level: string, ...messages: string[]): void {
  console.log(`[${level}]`, ...messages)
}

log('INFO', 'Server', 'started')  // [INFO] Server started
```

---

## 6. 函数重载

为同一函数定义多个签名。

### 基本重载

```typescript
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

format('hello')  // 'HELLO'
format(3.14159)  // '3.14'
```

### 复杂重载

```typescript
function createElement(tag: 'div'): HTMLDivElement
function createElement(tag: 'span'): HTMLSpanElement
function createElement(tag: 'input'): HTMLInputElement
function createElement(tag: string): HTMLElement {
  return document.createElement(tag)
}

const div = createElement('div')    // HTMLDivElement
const span = createElement('span')  // HTMLSpanElement
```

---

## 7. this 参数

显式指定 `this` 的类型。

```typescript
interface User {
  name: string
  greet(this: User): string
}

const user: User = {
  name: 'Alice',
  greet() {
    return `Hello, ${this.name}`
  }
}

user.greet()  // ✅
// const fn = user.greet
// fn()  // ❌ this 丢失
```

### this 参数在函数中

```typescript
function greet(this: { name: string }) {
  return `Hello, ${this.name}`
}

const user = { name: 'Alice', greet }
user.greet()  // ✅
```

---

## 8. 异步函数

### async/await

```typescript
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const user: User = await response.json()
  return user
}

// 使用
const user = await fetchUser(1)
```

### 泛型异步函数

```typescript
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return response.json()
}

// 使用
interface User {
  id: number
  name: string
}

const user = await fetchData<User>('/api/user/1')
```

### 错误处理

```typescript
async function safeFetch(url: string): Promise<Response | null> {
  try {
    return await fetch(url)
  } catch (error) {
    console.error('Fetch failed:', error)
    return null
  }
}
```

---

## 9. 高阶函数

接受函数作为参数或返回函数的函数。

### 函数作为参数

```typescript
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn)
}

const numbers = [1, 2, 3]
const doubled = map(numbers, x => x * 2)  // [2, 4, 6]
```

### 返回函数

```typescript
function createGreeter(greeting: string) {
  return function (name: string) {
    return `${greeting}, ${name}`
  }
}

const sayHello = createGreeter('Hello')
const sayHi = createGreeter('Hi')

sayHello('Alice')  // 'Hello, Alice'
sayHi('Bob')       // 'Hi, Bob'
```

### 装饰器风格

```typescript
function withLogging<T extends (...args: any[]) => any>(fn: T): T {
  return function (...args: any[]) {
    console.log(`调用 ${fn.name}`)
    console.log(`参数: ${JSON.stringify(args)}`)
    const result = fn(...args)
    console.log(`结果: ${JSON.stringify(result)}`)
    return result
  } as T
}

function add(a: number, b: number) {
  return a + b
}

const loggedAdd = withLogging(add)
loggedAdd(1, 2)
// 调用 add
// 参数: [1,2]
// 结果: 3
```

---

## 10. 实战案例

### 案例 1：类型安全的事件系统

```typescript
type EventMap = {
  click: { x: number; y: number }
  keydown: { key: string }
  resize: { width: number; height: number }
}

type EventKey = keyof EventMap

function on<K extends EventKey>(
  event: K,
  handler: (data: EventMap[K]) => void
) {
  // 注册事件处理
}

on('click', (data) => {
  console.log(data.x, data.y)  // 类型安全
})
```

### 案例 2：泛型数据获取

```typescript
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url)
  return response.json()
}

interface User {
  id: number
  name: string
}

const result = await apiGet<User>('/api/user/1')
console.log(result.data.name)  // 类型安全
```

### 案例 3：函数组合

```typescript
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a) => f(g(a))
}

const add10 = (x: number) => x + 10
const double = (x: number) => x * 2

const add10ThenDouble = compose(double, add10)
add10ThenDouble(5)  // 30
```

### 案例 4：柯里化

```typescript
function curry<A extends any[], B, C>(
  fn: (...args: [...A, B]) => C
): (...args: A) => (arg: B) => C {
  return (...args: A) => (arg: B) => fn(...args, arg)
}

const add = (a: number, b: number) => a + b
const add5 = curry(add)(5)

add5(3)  // 8
add5(10) // 15
```

---

## 小结

| 特性 | 语法 | 示例 |
|------|------|------|
| 基本声明 | `function f(x: T): R` | `function add(a: number): number` |
| 函数类型 | `(x: T) => R` | `type Fn = (a: number) => number` |
| 可选参数 | `x?: T` | `function f(a: string, b?: number)` |
| 默认参数 | `x = value` | `function f(a: string = 'hello')` |
| 剩余参数 | `...args: T[]` | `function f(...args: number[])` |
| 函数重载 | 多个签名 | `function f(x: string): string` |
| this 参数 | `this: Type` | `function f(this: User)` |
| async/await | `async function f()` | `async function fetch()` |

**最佳实践**：
- 优先使用箭头函数（简洁、this 绑定）
- 使用函数类型别名提高可读性
- 可选参数必须在必选参数之后
- 使用泛型创建可复用的类型安全函数
- async 函数始终返回 Promise
- 避免过长的函数重载
