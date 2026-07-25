# type-fest 使用指南

> type-fest 是由 Sindre Sorhus 维护的 TypeScript 实用类型集合，周下载量 3.3 亿（被上层工具作为依赖安装）。它补充了 TypeScript 内置工具类型无法覆盖的大量应用场景。

## 安装

```bash
npm install type-fest
```

要求：TypeScript >= 5.9，ESM 模块，tsconfig 中开启 `strict: true`。

---

## 目录

1. [基础类型](#1-基础类型)
2. [对象工具类型](#2-对象工具类型)
3. [字符串操作类型](#3-字符串操作类型)
4. [数组/元组类型](#4-数组元组类型)
5. [函数类型](#5-函数类型)
6. [JSON 类型](#6-json-类型)
7. [异步类型](#7-异步类型)
8. [类型守卫](#8-类型守卫)
9. [命名风格转换](#9-命名风格转换)
10. [条件逻辑类型](#10-条件逻辑类型)

---

## 1. 基础类型

### Primitive

匹配任何[原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)：`string`、`number`、`bigint`、`boolean`、`symbol`、`null`、`undefined`。

```typescript
import type { Primitive } from 'type-fest'

function printValue(value: Primitive) {
  console.log(value)
}

printValue('hello')  // ✅
printValue(42)       // ✅
printValue(true)     // ✅
// printValue({})    // ❌ 对象不是原始类型
```

### Class / Constructor

匹配 class 和 class 构造函数。

```typescript
import type { Class, Constructor } from 'type-fest'

class Animal {
  name: string
  constructor(name: string) { this.name = name }
}

// Class 匹配类本身
function createInstance<T extends Class>(cls: T): InstanceType<T> {
  return new (cls as any)()
}

// Constructor 匹配构造函数签名
function getClassConstructor<T extends Constructor>(ctr: T): T {
  return ctr
}
```

### TypedArray

匹配任何 TypedArray（如 `Uint8Array`、`Float64Array`）。

```typescript
import type { TypedArray } from 'type-fest'

function sum(arr: TypedArray): number {
  let total = 0
  for (const num of arr) total += num
  return total
}

sum(new Uint8Array([1, 2, 3]))    // 6
sum(new Float64Array([1.5, 2.5])) // 4
```

---

## 2. 对象工具类型

### Except（排除指定键）

从对象类型中排除某些键，类似 `Omit`，但更灵活。

```typescript
import type { Except } from 'type-fest'

interface User {
  id: number
  name: string
  password: string
  email: string
}

// 只暴露给前端的安全字段
type SafeUser = Except<User, 'password'>
// { id: number; name: string; email: string }
```

### Writable / WritableDeep

移除 `readonly` 修饰符。`WritableDeep` 深层移除。

```typescript
import type { Writable, WritableDeep } from 'type-fest'

interface Config {
  readonly host: string
  readonly port: number
  readonly db: {
    readonly name: string
  }
}

// Writable: 只移除顶层 readonly
type MutableConfig = Writable<Config>
// { host: string; port: number; readonly db: { readonly name: string } }

// WritableDeep: 深层移除所有 readonly
type DeepMutableConfig = WritableDeep<Config>
// { host: string; port: number; db: { name: string } }
```

### ReadonlyDeep

深层将所有属性变为只读。与 `WritableDeep` 互为反操作。

```typescript
import type { ReadonlyDeep } from 'type-fest'

interface Config {
  db: {
    host: string
    port: number
  }
  cache: string[]
}

type ImmutableConfig = ReadonlyDeep<Config>
// {
//   readonly db: { readonly host: string; readonly port: number }
//   readonly cache: readonly string[]
// }

// 适用场景：React 组件的 props 应该是不可变的
type Props = ReadonlyDeep<{
  user: { name: string; age: number }
  onUpdate: () => void
}>
```

### Merge / MergeDeep

合并两个类型，第二个类型覆盖第一个。

```typescript
import type { Merge, MergeDeep } from 'type-fest'

interface A {
  x: number
  y: string
}

interface B {
  y: number  // 覆盖 A 的 y
  z: boolean
}

type Result = Merge<A, B>
// { x: number; y: number; z: boolean }

// MergeDeep 支持嵌套对象合并
interface DeepA {
  user: { name: string; age: number }
}

interface DeepB {
  user: { email: string }
}

type DeepResult = MergeDeep<DeepA, DeepB>
// { user: { name: string; age: number; email: string } }
```

### SetOptional / SetRequired

将指定键设为可选/必选，其他键不变。

```typescript
import type { SetOptional, SetRequired } from 'type-fest'

interface User {
  id: number
  name: string
  email?: string
  phone?: string
}

// 创建用户时，email 和 phone 可选
type CreateUser = SetOptional<User, 'id'>
// id 变为可选，其他不变

// 更新用户时，至少提供 email 或 phone
type UpdateUser = SetRequired<User, 'name' | 'email'>
// name 和 email 变为必选
```

### RequiredDeep

深层将所有属性设为必选。

```typescript
import type { RequiredDeep } from 'type-fest'

interface Config {
  db?: {
    host?: string
    port?: number
  }
  cache?: {
    ttl?: number
  }
}

type StrictConfig = RequiredDeep<Config>
// { db: { host: string; port: number }; cache: { ttl: number } }
```

### PartialDeep

深层将所有属性设为可选（包括嵌套对象）。

```typescript
import type { PartialDeep } from 'type-fest'

interface Todo {
  title: string
  tags: string[]
  meta: {
    createdAt: Date
    updatedAt: Date
  }
}

type PartialTodo = PartialDeep<Todo>
// {
//   title?: string
//   tags?: string[]
//   meta?: { createdAt?: Date; updatedAt?: Date }
// }
```

### PickDeep / OmitDeep

从深层嵌套对象中选择/排除属性。使用**点号路径语法**指定深层属性。

```typescript
import type { PickDeep, OmitDeep } from 'type-fest'

interface AppState {
  user: {
    name: string
    email: string
    settings: {
      theme: string
      lang: string
    }
  }
  posts: { id: number; title: string }[]
}

// PickDeep: 使用点号路径语法选择深层属性
type UserBasic = PickDeep<AppState, 'user.name' | 'user.email'>
// { user: { name: string; email: string } }

// OmitDeep: 排除指定路径的属性
type WithoutPosts = OmitDeep<AppState, 'posts'>
// { user: { name: string; email: string; settings: { theme: string; lang: string } } }

// 深层选择：直接拿到嵌套的值
type UserTheme = PickDeep<AppState, 'user.settings.theme'>
// { user: { settings: { theme: string } } }
```

### Exact

禁止额外属性，只能传入明确声明的键。

```typescript
import type { Exact } from 'type-fest'

interface ButtonProps {
  color: string
  size: number
  onClick: () => void
}

// 普通类型检查：允许传入额外属性（结构化类型系统的弱点）
function createButton1(props: ButtonProps) { /* ... */ }
createButton1({ color: 'red', size: 10, onClick: () => {}, extra: true })  // ✅ 没报错

// Exact：严格检查，不允许额外属性
function createButton2(props: Exact<ButtonProps, ButtonProps>) { /* ... */ }
createButton2({ color: 'red', size: 10, onClick: () => {} })  // ✅
// createButton2({ color: 'red', size: 10, onClick: () => {}, extra: true })  // ❌
```

### ValueOf

获取对象所有值的联合类型。

```typescript
import type { ValueOf } from 'type-fest'

const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  DELETED: 'deleted',
} as const

type Status = ValueOf<typeof STATUS>
// 'pending' | 'active' | 'deleted'
```

### ConditionalPick / ConditionalPickDeep

按条件选取满足条件的键。

```typescript
import type { ConditionalPick } from 'type-fest'

interface Mixed {
  name: string
  age: number
  greet: () => void
  count: number
  action: (x: number) => void
}

type OnlyFunctions = ConditionalPick<Mixed, Function>
// { greet: () => void; action: (x: number) => void }

type OnlyNumbers = ConditionalPick<Mixed, number>
// { age: number; count: number }
```

### LiteralUnion

字面量联合 + 自动补全。让 IDE 在联合类型中提供自动补全，同时允许自定义值。

```typescript
import type { LiteralUnion } from 'type-fest'

// 普通联合类型：只能用 'primary' | 'secondary' | 'danger'
type ButtonVariant1 = 'primary' | 'secondary' | 'danger'

// LiteralUnion：IDE 自动补全这三个值，但也接受自定义值
type ButtonVariant2 = LiteralUnion<'primary' | 'secondary' | 'danger', string>

const v1: ButtonVariant2 = 'primary'    // ✅ 自动补全
const v2: ButtonVariant2 = 'danger'     // ✅ 自动补全
const v3: ButtonVariant2 = 'my-custom'  // ✅ 也允许自定义值
```

### Tagged（品牌类型）

创建标签类型，防止不同类型之间的意外混淆。

```typescript
import type { Tagged, UnwrapTagged } from 'type-fest'

// 定义不同类型的 ID，虽然底层都是 number，但不能混用
type UserId = Tagged<number, 'UserId'>
type OrderId = Tagged<number, 'OrderId'>

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 1 as UserId
const orderId = 2 as OrderId

getUser(userId)    // ✅
getUser(orderId)   // ❌ 类型不匹配，防止传错 ID

// UnwrapTagged: 提取原始类型
type RawUserId = UnwrapTagged<UserId>  // number
```

### Simplify

展平类型输出，改善 IDE 中的类型提示。

```typescript
import type { Simplify } from 'type-fest'

type A = { a: string } & { b: number } & { c: boolean }

// 不用 Simplify：IDE 显示复杂的交叉类型
type B = A
// { a: string } & { b: number } & { c: boolean }

// 用 Simplify：IDE 显示展平的对象类型
type C = Simplify<A>
// { a: string; b: number; c: boolean }
```

### SetNonNullable

将指定键变为非空（移除 `null` 和 `undefined`）。

```typescript
import type { SetNonNullable } from 'type-fest'

interface User {
  name: string
  email: string | null
  phone: string | undefined
}

type StrictUser = SetNonNullable<User, 'email' | 'phone'>
// { name: string; email: string; phone: string }
// email 和 phone 不再接受 null/undefined
```

### PickIndexSignature / OmitIndexSignature

处理索引签名：只选取/排除索引签名的键。

```typescript
import type { PickIndexSignature, OmitIndexSignature } from 'type-fest'

interface Example {
  [key: string]: number       // 索引签名
  name: string                // 显式定义的键
  age: number                 // 显式定义的键
}

// 只保留索引签名部分
type OnlyIndex = PickIndexSignature<Example>
// { [key: string]: number }

// 只保留显式定义的键（排除索引签名）
type ExplicitKeys = OmitIndexSignature<Example>
// { name: string; age: number }
```

---

## 3. 字符串操作类型

### CamelCase / KebabCase / PascalCase / SnakeCase

转换字符串的命名风格。

```typescript
import type { CamelCase, KebabCase, PascalCase, SnakeCase } from 'type-fest'

type A = CamelCase<'foo_bar'>
// 'fooBar'

type B = KebabCase<'fooBar'>
// 'foo-bar'

type C = PascalCase<'foo_bar'>
// 'FooBar'

type D = SnakeCase<'fooBar'>
// 'foo_bar'
```

### Trim / Split / Replace

字符串的裁剪、分割、替换操作。

```typescript
import type { Trim, Split, Replace } from 'type-fest'

type A = Trim<'  hello  '>
// 'hello'

type B = Split<'a.b.c', '.'>
// ['a', 'b', 'c']

type C = Replace<'foo_bar', '_', '-'>
// 'foo-bar'
```

### RemovePrefix / RemoveSuffix

移除字符串的前缀或后缀。

```typescript
import type { RemovePrefix, RemoveSuffix } from 'type-fest'

type A = RemovePrefix<'prefix_value', 'prefix_'>
// 'value'

type B = RemoveSuffix<'file.txt', '.txt'>
// 'file'
```

---

## 4. 数组/元组类型

### Arrayable

表示值可以是单个值或数组。

```typescript
import type { Arrayable } from 'type-fest'

function ensureArray(value: Arrayable<number>): number[] {
  return Array.isArray(value) ? value : [value]
}

ensureArray(1)       // [1]
ensureArray([1, 2])  // [1, 2]
```

### Includes

判断数组是否包含某个元素。

```typescript
import type { Includes } from 'type-fest'

type HasA = Includes<['a', 'b', 'c'], 'a'>  // true
type HasD = Includes<['a', 'b', 'c'], 'd'>  // false
```

### TupleToUnion

将元组转换为联合类型。

```typescript
import type { TupleToUnion } from 'type-fest'

type Colors = TupleToUnion<['red', 'green', 'blue']>
// 'red' | 'green' | 'blue'
```

### FixedLengthArray

创建固定长度的数组类型。

```typescript
import type { FixedLengthArray } from 'type-fest'

type ThreeNumbers = FixedLengthArray<number, 3>
// [number, number, number]

const arr: ThreeNumbers = [1, 2, 3]   // ✅
// const arr2: ThreeNumbers = [1, 2]   // ❌ 长度不对
```

### ArrayElement / LastArrayElement

提取数组元素类型。

```typescript
import type { ArrayElement, LastArrayElement } from 'type-fest'

type First = ArrayElement<[1, 2, 3]>  // 1
type Last = LastArrayElement<[1, 2, 3]>  // 3
```

---

## 5. 函数类型

### SetReturnType

更改函数的返回类型，参数不变。

```typescript
import type { SetReturnType } from 'type-fest'

function add(a: number, b: number): number {
  return a + b
}

// 将返回类型改为字符串
type StringAdd = SetReturnType<typeof add, string>
// (a: number, b: number) => string
```

### SetParameterType

替换函数的指定参数类型。

```typescript
import type { SetParameterType } from 'type-fest'

function greet(name: string, age: number): string {
  return `Hello ${name}, ${age}`
}

// 将 string 参数改为 number
type NumericGreet = SetParameterType<typeof greet, 0, number>
// (name: number, age: number) => string
```

---

## 6. JSON 类型

### JsonValue / JsonObject / JsonArray

表示合法的 JSON 值类型。

```typescript
import type { JsonValue, JsonObject, JsonArray } from 'type-fest'

const data: JsonValue = {
  name: 'Alice',
  age: 30,
  tags: ['admin', 'user'],
  active: true,
  meta: null
}

// JsonObject 只允许对象
const config: JsonObject = {
  host: 'localhost',
  port: 3000
}
```

### Jsonify

将 TypeScript 类型转换为 JSON 可序列化版本。

```typescript
import type { Jsonify } from 'type-fest'

interface User {
  name: string
  date: Date       // Date 不能直接序列化
  id: () => void   // 函数不能序列化
}

type Serialized = Jsonify<User>
// { name: string }  // Date 和函数被移除/转换
```

---

## 7. 异步类型

### Promisable

表示值可以是 `T` 或 `Promise<T>`。

```typescript
import type { Promisable } from 'type-fest'

// 函数返回值可以是同步或异步
function getData(): Promisable<string> {
  if (Math.random() > 0.5) {
    return 'sync data'
  }
  return Promise.resolve('async data')
}
```

### AsyncReturnType

提取异步函数的返回类型（解包 Promise）。

```typescript
import type { AsyncReturnType } from 'type-fest'

async function fetchUser() {
  return { id: 1, name: 'Alice' }
}

type UserType = AsyncReturnType<typeof fetchUser>
// { id: number; name: string }  // 自动解包 Promise
```

### Asyncify

将同步函数转为异步版本。

```typescript
import type { Asyncify } from 'type-fest'

function syncAdd(a: number, b: number): number {
  return a + b
}

type AsyncAdd = Asyncify<typeof syncAdd>
// (a: number, b: number) => Promise<number>
```

---

## 8. 类型守卫

### If / IsAny / IsNever / IsUnknown

条件判断类型，用于类型层面的 if-else。

```typescript
import type { If, IsAny, IsNever, IsUnknown } from 'type-fest'

// IsAny: 判断是否为 any
type A = IsAny<any>    // true
type B = IsAny<string> // false

// IsNever: 判断是否为 never
type C = IsNever<never>  // true
type D = IsNever<string> // false

// IsUnknown: 判断是否为 unknown
type E = IsUnknown<unknown>  // true
type F = IsUnknown<any>      // false

// If: 条件执行
type Result = If<IsAny<string>, 'yes', 'no'>  // 'no'
```

### IsLiteral / IsStringLiteral / IsNumericLiteral

判断是否为字面量类型。

```typescript
import type { IsLiteral, IsStringLiteral, IsNumericLiteral } from 'type-fest'

type A = IsLiteral<'hello'>      // true（字符串字面量）
type B = IsLiteral<string>       // false（宽泛类型）
type C = IsStringLiteral<'foo'>  // true
type D = IsNumericLiteral<42>    // true
type E = IsNumericLiteral<number> // false
```

---

## 9. 命名风格转换

### CamelCasedProperties / KebabCasedProperties / SnakeCasedProperties

将对象的键转换为对应的命名风格。

```typescript
import type { CamelCasedProperties, KebabCasedProperties, SnakeCasedProperties } from 'type-fest'

interface RawConfig {
  db_host: string
  db_port: number
  cache_ttl: number
}

type CamelConfig = CamelCasedProperties<RawConfig>
// { dbHost: string; dbPort: number; cacheTtl: number }

type KebabConfig = KebabCasedProperties<RawConfig>
// { db-host: string; db-port: number; cache-ttl: number }

// 还有 Deep 版本，递归转换嵌套对象
type SnakeDeep = SnakeCasedPropertiesDeep<{ user_info: { first_name: string } }>
// { user_info: { first_name: string } }  → snake_case 保持不变
```

---

## 10. 条件逻辑类型

### And / Or / Xor

布尔逻辑运算。

```typescript
import type { And, Or, Xor } from 'type-fest'

type A = And<true, true>     // true
type B = And<true, false>    // false
type C = Or<false, true>     // true
type D = Xor<true, false>    // true
type E = Xor<true, true>     // false
```

### AndAll / OrAll

判断数组中所有/任一元素是否为 true。

```typescript
import type { AndAll, OrAll } from 'type-fest'

type AllTrue = AndAll<[true, true, true]>  // true
type SomeFalse = AndAll<[true, false, true]>  // false

type AnyTrue = OrAll<[false, false, true]>  // true
type NoneTrue = OrAll<[false, false, false]>  // false
```

---

## 对比：type-fest vs TypeScript 内置类型

| 场景 | TypeScript 内置 | type-fest |
|------|----------------|-----------|
| 排除键 | `Omit<T, K>` | `Except<T, K>` |
| 深层可选 | — | `PartialDeep<T>` |
| 深层必选 | — | `RequiredDeep<T>` |
| 深层只读 | `Readonly<T>`（浅） | `ReadonlyDeep<T>`（深） |
| 深层可写 | — | `WritableDeep<T>` |
| 合并类型 | `A & B`（交叉） | `Merge<A, B>`（后者覆盖前者） |
| 命名风格转换 | — | `CamelCase<T>` 等 |
| JSON 类型 | — | `JsonValue` 等 |
| 布尔逻辑 | — | `And<T, U>` 等 |
| 条件选取 | — | `ConditionalPick<T, C>` |
| 类型守卫 | — | `IsAny<T>` 等 |
| 字面量联合 | — | `LiteralUnion<T>` |
| 品牌类型 | — | `Tagged<T, N>` |
| 索引签名处理 | — | `PickIndexSignature<T>` |
| 类型展平 | — | `Simplify<T>` |

---

## 小结

- **对象操作**：`Except`、`Merge`、`PartialDeep`、`RequiredDeep`、`WritableDeep`/`ReadonlyDeep` 是最常用的
- **字符串操作**：命名风格转换（`CamelCase` 等）在对接 API 时非常实用
- **类型守卫**：`If`、`IsAny`、`IsNever` 可以在类型层面做条件判断
- **JSON/异步**：`JsonValue`、`Promisable` 解决了序列化和异步场景的类型表达
- **高级场景**：`Tagged` 防止类型混淆，`LiteralUnion` 兼顾自动补全和灵活性，`Simplify` 改善 IDE 体验

type-fest 不是"全都要用"，而是按需引入——当你发现 TypeScript 内置类型搞不定时，先来这里找找。
