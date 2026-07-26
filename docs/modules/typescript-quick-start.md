# TypeScript 日常开发快速入门

> 聚焦日常开发中最常用的 TypeScript 特性，帮助你快速上手并高效使用 TypeScript。无论你是 JavaScript 开发者还是完全的新手，本文档都能让你在 5 分钟内开始使用 TypeScript。

## 目录

1. [快速开始](#1-快速开始)
2. [基础类型](#2-基础类型)
3. [接口与类型](#3-接口与类型)
4. [函数](#4-函数)
5. [类](#5-类)
6. [枚举](#6-枚举)
7. [泛型](#7-泛型)
8. [类型守卫](#8-类型守卫)
9. [映射类型](#9-映射类型)
10. [async/await](#10-asyncawait)
11. [模块](#11-模块)
12. [常用模式](#12-常用模式)

---

## 1. 快速开始

### 安装与配置

```bash
# 初始化项目
npm init -y
npm install typescript --save-dev

# 创建 tsconfig.json
npx tsc --init

# 编译 TypeScript
npx tsc

# 运行 TypeScript
npx ts-node index.ts
```

### tsconfig.json 推荐配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

---

## 2. 基础类型

### 原始类型

```typescript
let name: string = 'Alice'
let age: number = 30
let active: boolean = true
let data: null = null
let value: undefined = undefined
const id: symbol = Symbol('id')
const big: bigint = 12345678901234567890n
```

### 特殊类型

```typescript
let anything: any = 'hello'      // 任意类型（不推荐）
let safe: unknown = 'hello'      // 安全的 any（推荐）
let nothing: never               // 永远不会出现
function log(): void {}          // 无返回值
```

### 数组和元组

```typescript
// 数组
let numbers: number[] = [1, 2, 3]
let strings: Array<string> = ['a', 'b', 'c']

// 元组
let point: [number, number] = [10, 20]
let record: [string, number] = ['Alice', 30]
```

---

## 3. 接口与类型

### 接口（Interface）

```typescript
interface User {
  id: number
  name: string
  email?: string  // 可选属性
}

// 继承
interface Admin extends User {
  role: string
}
```

### 类型别名（Type）

```typescript
type ID = string | number
type Point = [number, number]
type Status = 'active' | 'inactive' | 'deleted'
type Callback = () => void
```

### 选择建议

| 场景 | 推荐 |
|------|------|
| 对象结构 | interface |
| 联合类型 | type |
| 元组 | type |
| 需要声明合并 | interface |

---

## 4. 函数

### 基本函数

```typescript
// 函数声明
function add(a: number, b: number): number {
  return a + b
}

// 箭头函数
const multiply = (a: number, b: number): number => a * b
```

### 可选参数和默认值

```typescript
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}`
}

greet('Alice')           // 'Hello, Alice'
greet('Alice', 'Hi')     // 'Hi, Alice'
```

### 剩余参数

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}

sum(1, 2, 3)        // 6
sum(1, 2, 3, 4, 5)  // 15
```

### 函数类型

```typescript
type MathFn = (a: number, b: number) => number

const add: MathFn = (a, b) => a + b
const subtract: MathFn = (a, b) => a - b
```

---

## 5. 类

### 基本类

```typescript
class User {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  greet(): string {
    return `Hello, ${this.name}`
  }
}
```

### 访问修饰符

```typescript
class User {
  public name: string      // 公开（默认）
  private age: number      // 私有
  protected email: string  // 受保护
  readonly id: number      // 只读

  constructor(name: string, age: number, email: string, id: number) {
    this.name = name
    this.age = age
    this.email = email
    this.id = id
  }
}
```

### 参数属性（简写）

```typescript
// 完整写法
class User {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

// 参数属性简写
class User {
  constructor(
    public name: string,
    public age: number
  ) {}
}
```

### 继承

```typescript
class Animal {
  name: string
  constructor(name: string) { this.name = name }
}

class Dog extends Animal {
  breed: string
  constructor(name: string, breed: string) {
    super(name)
    this.breed = breed
  }
  bark() { console.log('Woof!') }
}
```

### 抽象类

```typescript
abstract class Shape {
  abstract area(): number
  describe(): string {
    return `面积: ${this.area()}`
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super() }
  area(): number { return Math.PI * this.radius ** 2 }
}
```

---

## 6. 枚举

```typescript
// 数字枚举
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

// 字符串枚举
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

// const 枚举（编译时内联）
const enum Color {
  Red,
  Green,
  Blue
}

const color = Color.Red  // 编译后：const color = 0
```

---

## 7. 泛型

### 泛型函数

```typescript
function identity<T>(value: T): T {
  return value
}

identity('hello')  // string
identity(42)       // number
```

### 泛型约束

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }
getProperty(user, 'name')  // string
```

### 泛型类

```typescript
class Container<T> {
  private items: T[] = []
  add(item: T) { this.items.push(item) }
  get(index: number): T { return this.items[index] }
}

const nums = new Container<number>()
nums.add(1)
nums.add(2)
```

---

## 8. 类型守卫

### typeof 守卫

```typescript
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()  // string
  }
  return value.toFixed(2)       // number
}
```

### instanceof 守卫

```typescript
class Bird { fly() {} }
class Fish { swim() {} }

function move(animal: Bird | Fish) {
  if (animal instanceof Bird) {
    animal.fly()   // Bird
  } else {
    animal.swim()  // Fish
  }
}
```

### 自定义类型守卫

```typescript
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

## 9. 映射类型

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Partial: 所有属性可选
type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string }

// Readonly: 所有属性只读
type ReadonlyUser = Readonly<User>
// { readonly id: number; readonly name: string; ... }

// Pick: 选取指定键
type UserName = Pick<User, 'name' | 'email'>
// { name: string; email: string }

// Omit: 排除指定键
type UserWithoutId = Omit<User, 'id'>
// { name: string; email: string }

// Record: 构造键值映射
type CatMap = Record<'miffy' | 'boris', { age: number }>
// { miffy: { age: number }; boris: { age: number } }
```

---

## 10. async/await

```typescript
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// 错误处理
async function safeFetch(url: string): Promise<Response | null> {
  try {
    return await fetch(url)
  } catch (error) {
    console.error('请求失败:', error)
    return null
  }
}
```

---

## 11. 模块

```typescript
// 导出
export function add(a: number, b: number): number {
  return a + b
}

export interface User {
  id: number
  name: string
}

// 导入
import { add, User } from './math'

// 默认导出
export default class Logger {
  log(msg: string) { console.log(msg) }
}

// 导入默认导出
import Logger from './logger'
```

---

## 12. 常用模式

### 类型安全的事件系统

```typescript
type EventMap = {
  click: { x: number; y: number }
  keydown: { key: string }
}

function on<K extends keyof EventMap>(
  event: K,
  handler: (data: EventMap[K]) => void
) {
  // 类型安全
}

on('click', (data) => {
  console.log(data.x, data.y)
})
```

### 类型安全的 API

```typescript
interface ApiEndpoints {
  '/users': { id: number; name: string }
  '/posts': { id: number; title: string }
}

async function fetchApi<T extends keyof ApiEndpoints>(
  endpoint: T
): Promise<ApiEndpoints[T]> {
  const response = await fetch(endpoint)
  return response.json()
}
```

### Result 模式（替代 try/catch）

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return { ok: false, error: '除数不能为零' }
  return { ok: true, value: a / b }
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

| 特性 | 语法 | 示例 |
|------|------|------|
| 类型注解 | `x: Type` | `let name: string` |
| 接口 | `interface I {}` | `interface User { name: string }` |
| 类型别名 | `type T = Type` | `type ID = string \| number` |
| 函数类型 | `(args) => Type` | `type Fn = (x: number) => string` |
| 泛型 | `<T>` | `function id<T>(x: T): T` |
| 条件类型 | `T extends U ? X : Y` | `type A = T extends string ? true : false` |
| 映射类型 | `[K in keyof T]` | `{ [K in keyof T]?: T[K] }` |
| typeof | `typeof x` | `const type = typeof value` |
| keyof | `keyof T` | `type Keys = keyof User` |

---

## 最佳实践

1. **优先使用类型推断**：让 TypeScript 自动推导类型
2. **使用 unknown 替代 any**：更安全的类型处理
3. **使用 interface 定义对象**：更好的扩展性
4. **使用 type 定义联合类型**：更灵活的类型组合
5. **使用泛型创建可复用组件**：类型安全的复用
6. **始终开启 strict 模式**：更好的类型安全
