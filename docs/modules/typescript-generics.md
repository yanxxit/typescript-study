# TypeScript 泛型完全指南

> 泛型（Generics）是 TypeScript 最强大的特性之一，允许创建可复用的组件，这些组件可以支持多种类型而不预先指定具体类型。

## 目录

1. [什么是泛型](#1-什么是泛型)
2. [基础语法](#2-基础语法)
3. [泛型函数](#3-泛型函数)
4. [泛型接口](#4-泛型接口)
5. [泛型类](#5-泛型类)
6. [泛型约束](#6-泛型约束)
7. [泛型默认值](#7-泛型默认值)
8. [常用工具泛型](#8-常用工具泛型)
9. [高级泛型技巧](#9-高级泛型技巧)
10. [实战案例](#10-实战案例)

---

## 1. 什么是泛型

泛型是一种**类型参数**，让函数、接口、类能够适用于多种类型，同时保持类型安全。

```typescript
// 没有泛型：需要为每种类型写一个函数
function identityString(value: string): string { return value }
function identityNumber(value: number): number { return value }

// 有泛型：一个函数适用所有类型
function identity<T>(value: T): T { return value }

identity<string>('hello')  // ✅ 返回 string
identity<number>(42)       // ✅ 返回 number
identity(true)             // ✅ 类型推断为 boolean
```

---

## 2. 基础语法

### 泛型参数命名

通常使用单个大写字母：

| 字母 | 常见含义 |
|------|----------|
| `T` | Type（类型） |
| `U` | 第二个类型参数 |
| `K` | Key（键） |
| `V` | Value（值） |
| `E` | Element（元素） |
| `R` | Return（返回值） |

```typescript
function identity<T>(value: T): T {
  return value
}
```

### 类型推断

TypeScript 可以自动推断泛型类型，不需要显式指定：

```typescript
function identity<T>(value: T): T {
  return value
}

// 自动推断 T 为 string
const result = identity('hello')  // 类型：string

// 显式指定
const result2 = identity<string>('hello')  // 类型：string
```

---

## 3. 泛型函数

### 基本泛型函数

```typescript
function identity<T>(value: T): T {
  return value
}

identity('hello')     // string
identity(42)          // number
identity(true)        // boolean
```

### 多个泛型参数

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second]
}

pair('hello', 42)         // [string, number]
pair(true, 'world')       // [boolean, string]
```

### 泛型箭头函数

```typescript
const identity = <T>(value: T): T => value
const pair = <T, U>(first: T, second: U): [T, U] => [first, second]
```

### 泛型约束

使用 `extends` 约束泛型必须满足特定条件：

```typescript
// T 必须有 length 属性
function logLength<T extends { length: number }>(value: T): T {
  console.log(value.length)
  return value
}

logLength('hello')     // ✅ string 有 length
logLength([1, 2, 3])   // ✅ array 有 length
// logLength(42)       // ❌ number 没有 length
```

### keyof 约束

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }
getProperty(user, 'name')   // ✅ 返回 string
getProperty(user, 'age')    // ✅ 返回 number
// getProperty(user, 'email')  // ❌ 'email' 不在 keyof User 中
```

---

## 4. 泛型接口

### 基本泛型接口

```typescript
interface Box<T> {
  value: T
}

const numBox: Box<number> = { value: 42 }
const strBox: Box<string> = { value: 'hello' }
```

### 泛型函数接口

```typescript
interface Converter<T, U> {
  convert(input: T): U
}

const stringToNumber: Converter<string, number> = {
  convert(input) {
    return parseInt(input)
  }
}

stringToNumber.convert('42')  // 42
```

### 泛型接口与 API

```typescript
interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

interface User {
  id: number
  name: string
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

const response = await fetchUser(1)
response.data.name  // 类型安全
```

---

## 5. 泛型类

```typescript
class Container<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  get(index: number): T {
    return this.items[index]
  }

  getAll(): T[] {
    return [...this.items]
  }
}

const numContainer = new Container<number>()
numContainer.add(1)
numContainer.add(2)
// numContainer.add('3')  // ❌ 类型不匹配

const strContainer = new Container<string>()
strContainer.add('hello')
strContainer.add('world')
```

### 泛型类与接口

```typescript
interface Repository<T> {
  findById(id: string): T | null
  findAll(): T[]
  save(entity: T): void
  delete(id: string): boolean
}

class UserRepository implements Repository<User> {
  private users: User[] = []

  findById(id: string): User | null {
    return this.users.find(u => u.id === id) || null
  }

  findAll(): User[] {
    return this.users
  }

  save(user: User): void {
    this.users.push(user)
  }

  delete(id: string): boolean {
    const index = this.users.findIndex(u => u.id === id)
    if (index !== -1) {
      this.users.splice(index, 1)
      return true
    }
    return false
  }
}
```

---

## 6. 泛型约束

### 使用 extends 约束

```typescript
// T 必须是拥有 id 属性的对象
function findById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find(item => item.id === id)
}

interface User {
  id: string
  name: string
}

const users: User[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' }
]

findById(users, '1')  // ✅ 返回 User | undefined
```

### 多重约束

```typescript
interface HasLength {
  length: number
}

interface HasName {
  name: string
}

function logInfo<T extends HasLength & HasName>(value: T): void {
  console.log(`${value.name}: ${value.length}`)
}

logInfo({ name: 'Alice', length: 10 })  // ✅
```

### keyof 约束

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    result[key] = obj[key]
  }
  return result
}

const user = { name: 'Alice', age: 30, email: 'alice@example.com' }
const picked = pick(user, ['name', 'age'])
// { name: string; age: number }
```

---

## 7. 泛型默认值

为泛型参数提供默认类型：

```typescript
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 使用默认类型
const response: ApiResponse = {
  code: 200,
  message: 'OK',
  data: { anything: true }  // data 是 any 类型
}

// 指定具体类型
const userResponse: ApiResponse<User> = {
  code: 200,
  message: 'OK',
  data: { id: 1, name: 'Alice' }  // data 必须是 User
}
```

### 默认值与约束结合

```typescript
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value)
}

createArray(3, 'hello')      // string[]
createArray(3, 42)           // number[]
createArray<number>(3, 0)    // number[]
```

---

## 8. 常用工具泛型

### TypeScript 内置

```typescript
// Partial<T>: 所有属性可选
type Partial<T> = { [K in keyof T]?: T[K] }

// Required<T>: 所有属性必选
type Required<T> = { [K in keyof T]-?: T[K] }

// Readonly<T>: 所有属性只读
type Readonly<T> = { readonly [K in keyof T]: T[K] }

// Pick<T, K>: 选取指定键
type Pick<T, K extends keyof T> = { [P in K]: T[P] }

// Omit<T, K>: 排除指定键
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// Record<K, V>: 构造键值映射
type Record<K extends keyof any, T> = { [P in K]: T }
```

### 自定义工具泛型

```typescript
// DeepPartial: 深层可选
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

// DeepReadonly: 深层只读
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

// NonNullable<T>: 排除 null 和 undefined
type NonNullable<T> = T extends null | undefined ? never : T
```

---

## 9. 高级泛型技巧

### 条件泛型

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
```

### infer 推断

```typescript
// 提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// 提取 Promise 内部类型
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

type A = Awaited<Promise<string>>           // string
type B = Awaited<Promise<Promise<number>>>  // number
```

### 映射类型

```typescript
// 将对象的所有值变为 Promise
type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R
    ? Promise<R>
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

### 模板字面量泛型

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<'click'>  // 'onClick'
type FocusEvent = EventName<'focus'>  // 'onFocus'
```

---

## 10. 实战案例

### 案例 1：类型安全的事件发射器

```typescript
type EventMap = {
  click: { x: number; y: number }
  keydown: { key: string }
  resize: { width: number; height: number }
}

class TypedEventEmitter<Events extends Record<string, any>> {
  private listeners = new Map<string, Function[]>()

  on<K extends keyof Events>(
    event: K,
    listener: (data: Events[K]) => void
  ): void {
    const list = this.listeners.get(event as string) || []
    list.push(listener)
    this.listeners.set(event as string, list)
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.listeners.get(event as string)?.forEach(fn => fn(data))
  }
}

const emitter = new TypedEventEmitter<EventMap>()
emitter.on('click', (data) => {
  console.log(data.x, data.y)  // 类型安全
})
```

### 案例 2：通用 CRUD 操作

```typescript
interface Entity {
  id: string
}

class CRUD<T extends Entity> {
  private items: T[] = []

  create(item: T): T {
    this.items.push(item)
    return item
  }

  read(id: string): T | undefined {
    return this.items.find(item => item.id === id)
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const item = this.items.find(item => item.id === id)
    if (item) {
      Object.assign(item, updates)
    }
    return item
  }

  delete(id: string): boolean {
    const index = this.items.findIndex(item => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }

  list(): T[] {
    return [...this.items]
  }
}

interface User extends Entity {
  name: string
  email: string
}

const userCRUD = new CRUD<User>()
userCRUD.create({ id: '1', name: 'Alice', email: 'alice@example.com' })
```

### 案例 3：通用数据转换器

```typescript
class DataConverter<Input, Output> {
  constructor(
    private transform: (input: Input) => Output
  ) {}

  convert(input: Input): Output {
    return this.transform(input)
  }

  convertAll(inputs: Input[]): Output[] {
    return inputs.map(input => this.transform(input))
  }
}

// 字符串转数字
const strToNum = new DataConverter<string, number>(parseInt)
strToNum.convert('42')  // 42

// 对象转字符串
const userToStr = new DataConverter<User, string>(
  (user) => `${user.name} (${user.email})`
)
userToStr.convert({ id: '1', name: 'Alice', email: 'alice@example.com' })
// "Alice (alice@example.com)"
```

### 案例 4：通用缓存系统

```typescript
class Cache<K, V> {
  private store = new Map<K, { value: V; expiry: number }>()

  set(key: K, value: V, ttl: number = 60000): void {
    this.store.set(key, {
      value,
      expiry: Date.now() + ttl
    })
  }

  get(key: K): V | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiry) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  has(key: K): boolean {
    return this.get(key) !== undefined
  }

  delete(key: K): boolean {
    return this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}

// 使用
const userCache = new Cache<string, User>()
userCache.set('user:1', { id: '1', name: 'Alice', email: 'alice@example.com' }, 300000)
const user = userCache.get('user:1')  // 类型安全
```

---

## 小结

| 概念 | 语法 | 示例 |
|------|------|------|
| 泛型函数 | `function fn<T>(x: T): T` | `identity<string>('hello')` |
| 泛型接口 | `interface Box<T> { value: T }` | `Box<number>` |
| 泛型类 | `class Container<T> {}` | `Container<string>` |
| 泛型约束 | `T extends U` | `T extends { id: string }` |
| keyof 约束 | `K extends keyof T` | `getProperty(obj, key)` |
| 默认值 | `T = DefaultType` | `Array<T = any>` |
| 条件类型 | `T extends U ? X : Y` | `IsString<T>` |
| infer | `infer R` | `ReturnType<T>` |

**最佳实践**：
- 泛型参数命名要有意义（T、K、V、E 等）
- 使用 `extends` 约束泛型的形状
- 优先使用类型推断，只在必要时显式指定
- 泛型默认值可以让 API 更灵活
- 工具泛型可以大幅减少重复代码
