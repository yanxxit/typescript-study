# TypeScript 映射类型完全指南

> 映射类型（Mapped Types）是 TypeScript 中基于已有类型创建新类型的强大工具。它遍历类型的键，对每个键应用变换，生成新的类型。

## 目录

1. [什么是映射类型](#1-什么是映射类型)
2. [基本语法](#2-基本语法)
3. [键修饰符](#3-键修饰符)
4. [键重映射（as）](#4-键重映射as)
5. [内置映射类型](#5-内置映射类型)
6. [高级模式](#6-高级模式)
7. [实战案例](#7-实战案例)

---

## 1. 什么是映射类型

映射类型遍历对象类型的每个键，创建一个新类型。

```typescript
// 原始类型
interface User {
  id: number
  name: string
  email: string
}

// 映射类型：将所有属性变为可选
type PartialUser = {
  [K in keyof User]?: User[K]
}
// 等同于：{ id?: number; name?: string; email?: string }
```

---

## 2. 基本语法

### 语法结构

```typescript
type MappedType = {
  [K in keyof T]: NewType
}
```

### 基本示例

```typescript
interface User {
  id: number
  name: string
  email: string
}

// 遍历所有键，保持值类型不变
type ReadonlyUser = {
  readonly [K in keyof User]: User[K]
}

// 遍历所有键，将值类型变为 string
type StringUser = {
  [K in keyof User]: string
}
// { id: string; name: string; email: string }
```

### 使用泛型

```typescript
// 通用的只读类型
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

// 通用的部分类型
type Partial<T> = {
  [K in keyof T]?: T[K]
}
```

---

## 3. 键修饰符

### 添加只读

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

interface Config {
  host: string
  port: number
}

type ReadonlyConfig = Readonly<Config>
// { readonly host: string; readonly port: number }
```

### 添加可选

```typescript
type Partial<T> = {
  [K in keyof T]?: T[K]
}

interface User {
  id: number
  name: string
}

type PartialUser = Partial<User>
// { id?: number; name?: string }
```

### 移除只读

```typescript
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

interface Config {
  readonly host: string
  readonly port: number
}

type MutableConfig = Mutable<Config>
// { host: string; port: number }
```

### 移除可选

```typescript
type Required<T> = {
  [K in keyof T]-?: T[K]
}

interface Config {
  host?: string
  port?: number
}

type RequiredConfig = Required<Config>
// { host: string; port: number }
```

---

## 4. 键重映射（as）

TypeScript 4.1 引入了键重映射功能。

### 基本语法

```typescript
type MappedType = {
  [K in keyof T as NewKey]: T[K]
}
```

### 添加前缀

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface User {
  name: string
  age: number
}

type UserGetters = Getters<User>
// {
//   getName: () => string
//   getAge: () => number
// }
```

### 过滤键

```typescript
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}

interface Mixed {
  name: string
  age: number
  email: string
}

type StringProps = OnlyStrings<Mixed>
// { name: string; email: string }
```

### 移除键

```typescript
type RemoveKey<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

interface User {
  id: number
  name: string
  password: string
}

type SafeUser = RemoveKey<User, 'password'>
// { id: number; name: string }
```

---

## 5. 内置映射类型

### Partial\<Type\>

```typescript
type Partial<T> = { [K in keyof T]?: T[K] }

// 使用
type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string }
```

### Required\<Type\>

```typescript
type Required<T> = { [K in keyof T]-?: T[K] }

// 使用
type RequiredConfig = Required<Config>
// { host: string; port: number }
```

### Readonly\<Type\>

```typescript
type Readonly<T> = { readonly [K in keyof T]: T[K] }

// 使用
type ReadonlyUser = Readonly<User>
// { readonly id: number; readonly name: string }
```

### Pick\<Type, Keys\>

```typescript
type Pick<T, K extends keyof T> = { [P in K]: T[P] }

// 使用
type UserName = Pick<User, 'name' | 'email'>
// { name: string; email: string }
```

### Record\<Keys, Type\>

```typescript
type Record<K extends keyof any, T> = { [P in K]: T }

// 使用
type CatMap = Record<'miffy' | 'boris', { age: number }>
// { miffy: { age: number }; boris: { age: number } }
```

---

## 6. 高级模式

### 条件映射

```typescript
// 根据值类型选择变换
type ConditionalPartial<T> = {
  [K in keyof T]: T[K] extends object ? Partial<T[K]> : T[K]
}

interface Config {
  db: { host: string; port: number }
  name: string
}

type PartialConfig = ConditionalPartial<Config>
// { db?: Partial<{ host: string; port: number }>; name: string }
```

### 键重映射 + 条件

```typescript
// 只重映射函数类型的键
type MethodNames<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K]
}

interface Api {
  name: string
  getUser(id: number): User
  getPost(id: number): Post
  age: number
}

type Methods = MethodNames<Api>
// { getUser(id: number): User; getPost(id: number): Post }
```

### 嵌套映射

```typescript
// 深度只读
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepReadonly<T[K]>
    : T[K]
}
```

---

## 7. 实战案例

### 案例 1：表单状态管理

```typescript
interface FormState {
  name: string
  email: string
  age: number
  bio: string
}

// 所有字段初始状态
type InitialState = {
  [K in keyof FormState]: {
    value: FormState[K]
    error: string | null
    touched: boolean
  }
}

function createFormState<T extends object>(initial: T): { [K in keyof T]: { value: T[K]; error: string | null; touched: boolean } } {
  const state = {} as any
  for (const key of Object.keys(initial)) {
    state[key] = { value: (initial as any)[key], error: null, touched: false }
  }
  return state
}
```

### 案例 2：类型安全的配置

```typescript
interface Config {
  database: {
    host: string
    port: number
  }
  cache: {
    ttl: number
  }
  logging: boolean
}

// 创建配置验证器
type Validators<T> = {
  [K in keyof T]: T[K] extends object
    ? Validators<T[K]>
    : (value: any) => boolean
}

const validators: Validators<Config> = {
  database: {
    host: (v) => typeof v === 'string',
    port: (v) => typeof v === 'number' && v > 0
  },
  cache: {
    ttl: (v) => typeof v === 'number' && v > 0
  },
  logging: (v) => typeof v === 'boolean'
}
```

### 案例 3：API 响应类型

```typescript
// 为所有方法创建 Promise 版本
type PromisifyMethods<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[K]
}

interface SyncApi {
  getUser(id: number): User
  getPost(id: number): Post
  name: string
}

type AsyncApi = PromisifyMethods<SyncApi>
// {
//   getUser(id: number): Promise<User>
//   getPost(id: number): Promise<Post>
//   name: string
// }
```

---

## 小结

| 语法 | 说明 |
|------|------|
| `[K in keyof T]: V` | 基本映射 |
| `readonly [K in keyof T]: V` | 添加只读 |
| `[K in keyof T]?: V` | 添加可选 |
| `-readonly [K in keyof T]: V` | 移除只读 |
| `[K in keyof T]-?: V` | 移除可选 |
| `[K in keyof T as NewKey]: V` | 键重映射 |

**最佳实践**：
- 使用映射类型创建可复用的类型工具
- 结合条件类型实现更灵活的变换
- 使用键重映射过滤或重命名键
- 注意深度映射的递归处理
