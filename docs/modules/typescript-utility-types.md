# TypeScript Utility Types 完全指南

> Utility Types（工具类型）是 TypeScript 内置的类型转换工具，用于对已有类型进行变换。掌握它们，可以大幅减少重复代码，提高类型安全性。

## 目录

1. [什么是 Utility Types](#1-什么是-utility-types)
2. [对象操作](#2-对象操作)
3. [联合类型操作](#3-联合类型操作)
4. [函数操作](#4-函数操作)
5. [字符串操作](#5-字符串操作)
6. [类型推断工具](#6-类型推断工具)
7. [自定义 Utility Types](#7-自定义-utility-types)
8. [对比 type-fest](#8-对比-type-fest)
9. [实战案例](#9-实战案例)

---

## 1. 什么是 Utility Types

Utility Types 是 TypeScript 内置的**类型转换函数**，用于对已有类型进行变换。

```typescript
// 原始类型
interface User {
  id: number
  name: string
  email: string
}

// 使用 Utility Types 变换类型
type PartialUser = Partial<User>        // 所有属性可选
type ReadonlyUser = Readonly<User>      // 所有属性只读
type UserName = Pick<User, 'name'>     // 只取 name
type UserWithoutEmail = Omit<User, 'email'>  // 排除 email
```

---

## 2. 对象操作

### Partial\<Type\>

将所有属性变为可选。

```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

// 更新时只需传部分字段
function updateTodo(todo: Todo, fields: Partial<Todo>): Todo {
  return { ...todo, ...fields }
}

// 原理：type Partial<T> = { [P in keyof T]?: T[P] }
```

### Required\<Type\>

将所有属性变为必选。

```typescript
interface Config {
  host?: string
  port?: number
}

// 强制要求所有配置
function createServer(config: Required<Config>) {
  console.log(`服务器启动: ${config.host}:${config.port}`)
}

// 原理：type Required<T> = { [P in keyof T]-?: T[P] }
```

### Readonly\<Type\>

将所有属性变为只读。

```typescript
interface Config {
  host: string
  port: number
}

const config: Readonly<Config> = { host: 'localhost', port: 3000 }
config.host = 'example.com'  // ❌ 报错

// 原理：type Readonly<T> = { readonly [P in keyof T]: T[P] }
```

### Record\<Keys, Type\>

构造键值映射。

```typescript
type CatName = 'miffy' | 'boris' | 'mordred'

const cats: Record<CatName, { age: number }> = {
  miffy: { age: 10 },
  boris: { age: 5 },
  mordred: { age: 16 }
}

// 原理：type Record<K extends keyof any, T> = { [P in K]: T }
```

### Pick\<Type, Keys\>

选取指定的键。

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
}

type UserPreview = Pick<User, 'id' | 'name'>
// { id: number; name: string }
```

### Omit\<Type, Keys\>

排除指定的键。

```typescript
type SafeUser = Omit<User, 'password'>
// { id: number; name: string; email: string }
```

### Extract\<Type, Union\>

从联合类型中提取成员。

```typescript
type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>  // 'a'
type T1 = Extract<string | number | Function, Function>  // Function
```

### Exclude\<UnionType, ExcludedMembers\>

从联合类型中排除成员。

```typescript
type T0 = Exclude<'a' | 'b' | 'c', 'a'>  // 'b' | 'c'
type T1 = Exclude<string | number | Function, Function>  // string | number
```

### NonNullable\<Type\>

排除 null 和 undefined。

```typescript
type T0 = NonNullable<string | number | undefined>  // string | number
type T1 = NonNullable<string[] | null | undefined>  // string[]
```

---

## 3. 联合类型操作

### UnionToIntersection（type-fest）

将联合类型转换为交叉类型。

```typescript
type Union = 'a' | 'b' | 'c'
type Intersection = UnionToIntersection<Union>  // never（字面量联合）
```

### ValueOf（type-fest）

获取对象所有值的联合类型。

```typescript
const STATUS = { PENDING: 'pending', ACTIVE: 'active', DELETED: 'deleted' } as const
type Status = ValueOf<typeof STATUS>  // 'pending' | 'active' | 'deleted'
```

---

## 4. 函数操作

### Parameters\<Type\>

提取函数参数类型。

```typescript
function greet(name: string, age: number): void {}
type Params = Parameters<typeof greet>  // [string, number]
```

### ReturnType\<Type\>

提取函数返回类型。

```typescript
function getUser() { return { id: 1, name: 'Alice' } }
type User = ReturnType<typeof getUser>  // { id: number; name: string }
```

### ConstructorParameters\<Type\>

提取构造函数参数类型。

```typescript
class Article {
  constructor(title: string, content?: string) {}
}
type Params = ConstructorParameters<typeof Article>  // [string, string?]
```

### InstanceType\<Type\>

提取实例类型。

```typescript
class Cat { name: string }
type CatInstance = InstanceType<typeof Cat>  // Cat
```

### ThisParameterType\<Type\>

提取 this 参数类型。

```typescript
function toHex(this: Number) { return this.toString(16) }
type HexThis = ThisParameterType<typeof toHex>  // Number
```

### OmitThisParameter\<Type\>

移除 this 参数。

```typescript
function toHex(this: Number) { return this.toString(16) }
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5)
```

### ThisType\<Type\>

标记上下文 this 类型。

```typescript
type ObjectDescriptor<D, M> = {
  data?: D
  methods?: M & ThisType<D & M>
}
```

### NoInfer\<Type\>

阻止类型推断传播。

```typescript
function create<T extends string>(colors: T[], defaultColor?: NoInfer<T>) {}
create(['red', 'yellow'], 'red')  // ✅
// create(['red', 'yellow'], 'blue')  // ❌
```

---

## 5. 字符串操作

### Uppercase\<S\>

```typescript
type T = Uppercase<'hello'>  // 'HELLO'
```

### Lowercase\<S\>

```typescript
type T = Lowercase<'HELLO'>  // 'hello'
```

### Capitalize\<S\>

```typescript
type T = Capitalize<'hello'>  // 'Hello'
```

### Uncapitalize\<S\>

```typescript
type T = Uncapitalize<'Hello'>  // 'hello'
```

### 模板字面量类型

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`
type ClickEvent = EventName<'click'>  // 'onClick'
```

---

## 6. 类型推断工具

### Awaited\<Type\>

递归解包 Promise。

```typescript
type A = Awaited<Promise<string>>           // string
type B = Awaited<Promise<Promise<number>>>  // number
```

### infer 关键字

在条件类型中推断类型。

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type FirstArg<T> = T extends (first: infer F, ...args: any[]) => any ? F : never
```

---

## 7. 自定义 Utility Types

### DeepPartial

```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
```

### DeepReadonly

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}
```

### Nullable

```typescript
type Nullable<T> = T | null
```

### NonEmpty

```typescript
type NonEmpty<T> = T extends '' ? never : T
```

### Flatten

```typescript
type Flatten<T> = T extends Array<infer U> ? U : T
```

---

## 8. 对比 type-fest

| 场景 | TypeScript 内置 | type-fest |
|------|----------------|-----------|
| 深层可选 | — | `PartialDeep<T>` |
| 深层必选 | — | `RequiredDeep<T>` |
| 深层只读 | `Readonly<T>`（浅） | `ReadonlyDeep<T>`（深） |
| 命名风格 | — | `CamelCase<T>` 等 |
| JSON 类型 | — | `JsonValue` 等 |
| 布尔逻辑 | — | `And<T, U>` 等 |
| 字面量联合 | — | `LiteralUnion<T>` |
| 品牌类型 | — | `Tagged<T, N>` |
| 索引签名 | — | `PickIndexSignature<T>` |

---

## 9. 实战案例

### 案例 1：类型安全的 API

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
}

// 创建 DTO：排除敏感字段
type CreateUserDTO = Omit<User, 'id' | 'password'>

// 更新 DTO：部分字段可选
type UpdateUserDTO = Partial<Omit<User, 'id'>>

// 响应类型：排除密码
type UserResponse = Omit<User, 'password'>
```

### 案例 2：配置系统

```typescript
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

// 深层部分配置
type PartialConfig = DeepPartial<Config>

// 深层必选配置
type StrictConfig = DeepRequired<Config>
```

### 案例 3：事件系统

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
```

---

## 小结

### 内置 Utility Types 速查表

| 类型 | 作用 |
|------|------|
| `Partial<T>` | 所有属性可选 |
| `Required<T>` | 所有属性必选 |
| `Readonly<T>` | 所有属性只读 |
| `Record<K,V>` | 构造键值映射 |
| `Pick<T,K>` | 选取指定键 |
| `Omit<T,K>` | 排除指定键 |
| `Exclude<T,U>` | 排除联合成员 |
| `Extract<T,U>` | 提取联合成员 |
| `NonNullable<T>` | 排除 null/undefined |
| `Parameters<T>` | 提取函数参数 |
| `ReturnType<T>` | 提取返回类型 |
| `ConstructorParameters<T>` | 提取构造函数参数 |
| `InstanceType<T>` | 提取实例类型 |
| `Awaited<T>` | 解包 Promise |
| `NoInfer<T>` | 阻止类型推断 |

**最佳实践**：
- 优先使用内置 Utility Types
- 复杂场景考虑 type-fest
- 自定义 Utility Types 按需创建
- 保持类型转换的可读性
