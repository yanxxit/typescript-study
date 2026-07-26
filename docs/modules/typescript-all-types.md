# TypeScript 全部类型完全指南

> TypeScript 的类型系统是其核心特性。本文档全面梳理 TypeScript 中的所有类型，从基础到高级，帮助你构建完整的类型知识体系。

## 目录

1. [原始类型](#1-原始类型)
2. [特殊类型](#2-特殊类型)
3. [对象类型](#3-对象类型)
4. [数组与元组](#4-数组与元组)
5. [联合与交叉类型](#5-联合与交叉类型)
6. [字面量类型](#6-字面量类型)
7. [函数类型](#7-函数类型)
8. [类类型](#8-类类型)
9. [接口与类型别名](#9-接口与类型别名)
10. [枚举类型](#10-枚举类型)
11. [泛型](#11-泛型)
12. [条件类型](#12-条件类型)
13. [映射类型](#13-映射类型)
14. [模板字面量类型](#14-模板字面量类型)
15. [类型守卫与断言](#15-类型守卫与断言)

---

## 1. 原始类型

TypeScript 有 7 种原始类型：

```typescript
// number: 数字（整数、浮点数）
let age: number = 25
let price: number = 9.99

// string: 字符串
let name: string = 'Alice'
let message: string = `Hello ${name}`

// boolean: 布尔值
let isActive: boolean = true

// null: 空值
let data: null = null

// undefined: 未定义
let value: undefined = undefined

// symbol: 唯一标识符
const KEY: symbol = Symbol('key')

// bigint: 任意精度整数
let bigNum: bigint = 12345678901234567890n
```

---

## 2. 特殊类型

### any

绕过类型检查，不推荐使用。

```typescript
let anything: any = 'hello'
anything = 42        // ✅
anything = true      // ✅
anything.foo()       // ✅ 不报错，但运行时可能出错
```

### unknown

类型安全的 `any`，必须先检查类型才能使用。

```typescript
let value: unknown = 'hello'

// value.toUpperCase()  // ❌ 错误
if (typeof value === 'string') {
  value.toUpperCase()   // ✅ 正确
}
```

### never

永远不会出现的值，用于抛出错误或无限循环。

```typescript
function throwError(msg: string): never {
  throw new Error(msg)
}

function infiniteLoop(): never {
  while (true) {}
}
```

### void

没有返回值的函数。

```typescript
function log(message: string): void {
  console.log(message)
}
```

### null 和 undefined

```typescript
let a: null = null
let b: undefined = undefined

// 与原始类型联合
let c: string | null = null
let d: string | undefined = undefined
```

---

## 3. 对象类型

### 内联对象类型

```typescript
function printUser(user: { name: string; age: number }) {
  console.log(`${user.name}, ${user.age}`)
}

printUser({ name: 'Alice', age: 30 })  // ✅
```

### 可选属性

```typescript
interface Config {
  host: string
  port?: number  // 可选
  debug?: boolean
}

const config: Config = { host: 'localhost' }  // ✅
```

### 只读属性

```typescript
interface Config {
  readonly host: string
  readonly port: number
}

const config: Config = { host: 'localhost', port: 3000 }
config.host = 'example.com'  // ❌ 只读
```

### 索引签名

```typescript
interface StringMap {
  [key: string]: string
}

const dict: StringMap = {
  name: 'Alice',
  age: '30'
}
```

---

## 4. 数组与元组

### 数组

```typescript
// 方式一
let numbers: number[] = [1, 2, 3]

// 方式二（泛型）
let strings: Array<string> = ['a', 'b', 'c']
```

### 元组

固定长度和固定类型的数组。

```typescript
let point: [number, number] = [10, 20]
let record: [string, number] = ['Alice', 30]

// 可选元素
let response: [number, string, string?] = [200, 'OK']

// 只读元组
let readonlyPoint: readonly [number, number] = [10, 20]
```

---

## 5. 联合与交叉类型

### 联合类型

值可以是多种类型之一。

```typescript
type ID = string | number

let userId: ID = 123
userId = 'abc'

// 字面量联合
type Direction = 'up' | 'down' | 'left' | 'right'
type HttpStatus = 200 | 301 | 404 | 500
```

### 交叉类型

合并多个类型。

```typescript
type Person = { name: string; age: number }
type Employee = { company: string; position: string }

type Staff = Person & Employee
// { name: string; age: number; company: string; position: string }
```

---

## 6. 字面量类型

值本身就是类型。

```typescript
// 字符串字面量
type Theme = 'light' | 'dark'
type Direction = 'up' | 'down' | 'left' | 'right'

// 数字字面量
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6

// 布尔字面量
type Success = true

// const 断言
const config = {
  host: 'localhost',
  port: 3000
} as const
// 类型：{ readonly host: 'localhost'; readonly port: 3000 }
```

---

## 7. 函数类型

### 函数声明

```typescript
function add(a: number, b: number): number {
  return a + b
}
```

### 函数表达式

```typescript
const add = (a: number, b: number): number => a + b
```

### 函数类型

```typescript
type MathFn = (a: number, b: number) => number

const add: MathFn = (a, b) => a + b
const subtract: MathFn = (a, b) => a - b
```

### 可选参数与默认值

```typescript
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}`
}

function greet2(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}`
}
```

### 剩余参数

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}

sum(1, 2, 3)  // 6
```

### 函数重载

```typescript
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}
```

---

## 8. 类类型

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

### 抽象类

```typescript
abstract class Shape {
  abstract area(): number
  abstract perimeter(): number

  describe(): string {
    return `面积: ${this.area()}, 周长: ${this.perimeter()}`
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super()
  }

  area(): number {
    return Math.PI * this.radius ** 2
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius
  }
}
```

### 实现接口

```typescript
interface Printable {
  print(): void
}

class Document implements Printable {
  constructor(public title: string) {}

  print(): void {
    console.log(this.title)
  }
}
```

---

## 9. 接口与类型别名

### 接口

```typescript
interface User {
  id: number
  name: string
  email: string
}

// 继承
interface Admin extends User {
  role: string
}
```

### 类型别名

```typescript
type ID = string | number
type Point = [number, number]
type Direction = 'up' | 'down' | 'left' | 'right'
type Callback = () => void
type Box<T> = { value: T }
```

### 选择建议

| 场景 | 推荐 |
|------|------|
| 对象结构 | interface |
| 需要声明合并 | interface |
| 联合类型 | type |
| 元组 | type |
| 映射类型 | type |

---

## 10. 枚举类型

### 数字枚举

```typescript
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}
```

### 字符串枚举

```typescript
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}
```

### const 枚举

```typescript
const enum Color {
  Red,
  Green,
  Blue
}

const color = Color.Red  // 编译后：const color = 0
```

---

## 11. 泛型

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
```

### 泛型类

```typescript
class Container<T> {
  private items: T[] = []
  add(item: T) { this.items.push(item) }
  get(index: number): T { return this.items[index] }
}
```

---

## 12. 条件类型

```typescript
// 基本条件类型
type IsString<T> = T extends string ? true : false

// infer 推断
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never
```

---

## 13. 映射类型

```typescript
// 基本映射类型
type Partial<T> = { [K in keyof T]?: T[K] }
type Required<T> = { [K in keyof T]-?: T[K] }
type Readonly<T> = { readonly [K in keyof T]: T[K] }

// 键重映射
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}
```

---

## 14. 模板字面量类型

```typescript
// 基本模板字面量
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<'click'>  // 'onClick'

// 联合类型组合
type Color = 'red' | 'blue'
type Size = 'sm' | 'lg'
type ColorSize = `${Color}-${Size}`
// 'red-sm' | 'red-lg' | 'blue-sm' | 'blue-lg'
```

---

## 15. 类型守卫与断言

### typeof 守卫

```typescript
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}
```

### instanceof 守卫

```typescript
function process(error: Error) {
  if (error instanceof TypeError) {
    console.log(error.message)
  }
}
```

### 自定义类型守卫

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
```

### 类型断言

```typescript
let value: unknown = 'hello'
let length = (value as string).length
```

---

## 类型总览

| 类别 | 类型 |
|------|------|
| 原始 | string, number, boolean, null, undefined, symbol, bigint |
| 特殊 | any, unknown, never, void |
| 对象 | object, Object |
| 数组 | T[], Array\<T\> |
| 元组 | [T1, T2, ...] |
| 联合 | A \| B |
| 交叉 | A & B |
| 字面量 | 'value', 123, true |
| 函数 | (args) => return |
| 类 | class |
| 接口 | interface |
| 类型别名 | type |
| 枚举 | enum |
| 泛型 | T, K, V |
| 条件 | T extends U ? X : Y |
| 映射 | { [K in keyof T]: V } |
| 模板 | \`prefix\${T}\` |
