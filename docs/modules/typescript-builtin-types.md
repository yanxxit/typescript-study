# TypeScript 内置工具类型指南

> TypeScript 提供了一系列内置工具类型，用于常见的类型转换。这些类型无需安装额外依赖，全局可用。

## 目录

1. [对象操作](#1-对象操作)
2. [联合类型操作](#2-联合类型操作)
3. [函数操作](#3-函数操作)
4. [字符串操作](#4-字符串操作)
5. [其他实用类型](#5-其他实用类型)

---

## 1. 对象操作

### Partial\<Type\>

将所有属性变为**可选**。

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

const todo: Todo = {
  title: '学习 TypeScript',
  description: '掌握工具类型',
  completed: false
}

// 只更新 completed
updateTodo(todo, { completed: true })
```

**原理**：通过映射类型实现：
```typescript
type Partial<T> = { [P in keyof T]?: T[P] }
```

---

### Required\<Type\>

将所有属性变为**必选**。`Partial` 的反操作。

```typescript
interface Props {
  a?: number
  b?: string
}

const obj: Props = { a: 5 }  // ✅ b 是可选的

const obj2: Required<Props> = { a: 5 }
// ❌ 报错：缺少必选属性 'b'
// 必须：{ a: number; b: string }
```

---

### Readonly\<Type\>

将所有属性变为**只读**，不可重新赋值。

```typescript
interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: '学习 TypeScript'
}

todo.title = '新标题'  // ❌ 不能赋值给只读属性
```

**典型用法**：配合 `Object.freeze()` 使用，运行时冻结对象，编译时也禁止修改。

```typescript
function freeze<T>(obj: T): Readonly<T> {
  return Object.freeze(obj)
}
```

---

### Record\<Keys, Type\>

创建一个对象类型，键为 `Keys`，值为 `Type`。

```typescript
// 方式一：联合类型作为键
type CatName = 'miffy' | 'boris' | 'mordred'

interface CatInfo {
  age: number
  breed: string
}

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: 'Persian' },
  boris: { age: 5, breed: 'Maine Coon' },
  mordred: { age: 16, breed: 'British Shorthair' }
}

// 方式二：等价的原始写法
const cats2: { [key in CatName]: CatInfo } = {
  miffy: { age: 10, breed: 'Persian' },
  boris: { age: 5, breed: 'Maine Coon' },
  mordred: { age: 16, breed: 'British Shorthair' }
}
```

---

### Pick\<Type, Keys\>

从类型中**选取**指定的键，忽略其余。

```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
  title: '清洁房间',
  completed: false
}
// ✅ 不需要 description
```

---

### Omit\<Type, Keys\>

从类型中**排除**指定的键，保留其余。`Pick` 的反操作。

```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
  createdAt: number
}

// 前端展示不需要创建时间
type TodoView = Omit<Todo, 'createdAt'>

const todo: TodoView = {
  title: '清洁房间',
  description: '整理书桌',
  completed: false
}
```

**原理**：
```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

---

## 2. 联合类型操作

### Exclude\<UnionType, ExcludedMembers\>

从联合类型中**排除**指定的成员。

```typescript
type T0 = Exclude<'a' | 'b' | 'c', 'a'>
// 'b' | 'c'

type T1 = Exclude<string | number | (() => void), Function>
// string | number

// 排除特定对象类型
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; x: number }
  | { kind: 'triangle'; x: number; y: number }

type NoCircle = Exclude<Shape, { kind: 'circle' }>
// { kind: 'square'; x: number } | { kind: 'triangle'; x: number; y: number }
```

---

### Extract\<Type, Union\>

从类型中**提取**可赋值给联合类型的成员。`Exclude` 的反操作。

```typescript
type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>
// 'a'

type T1 = Extract<string | number | (() => void), Function>
// () => void

// 提取特定对象类型
type CircleOnly = Extract<Shape, { kind: 'circle' }>
// { kind: 'circle'; radius: number }
```

---

### NonNullable\<Type\>

从类型中**排除** `null` 和 `undefined`。

```typescript
type T0 = NonNullable<string | number | undefined>
// string | number

type T1 = NonNullable<string[] | null | undefined>
// string[]

// 实际应用：处理可空类型
function process(value: string | null | undefined): NonNullable<string | null | undefined> {
  return value ?? 'default'
}
```

---

## 3. 函数操作

### Parameters\<Type\>

提取函数**参数类型**的元组。

```typescript
declare function greet(name: string, age: number): void

type Params = Parameters<typeof greet>
// [name: string, age: number]

// 使用
function callWithDefaults(fn: (...args: Parameters<typeof greet>) => void) {
  fn('Alice', 30)  // ✅ 类型安全
}
```

---

### ConstructorParameters\<Type\>

提取构造函数**参数类型**的元组。

```typescript
class Article {
  constructor(title: string, content?: string) {}
}

type Params = ConstructorParameters<typeof Article>
// [title: string, content?: string]

// 使用：缓存实例
class InstanceCache<T extends new (...args: any[]) => any> {
  private cache = new Map<string, InstanceType<T>>()

  getInstance(...args: ConstructorParameters<T>): InstanceType<T> {
    const key = JSON.stringify(args)
    if (!this.cache.has(key)) {
      this.cache.set(key, new (...args)())
    }
    return this.cache.get(key)!
  }
}
```

---

### ReturnType\<Type\>

提取函数**返回类型**。

```typescript
function getUser() {
  return { id: 1, name: 'Alice', age: 30 }
}

type User = ReturnType<typeof getUser>
// { id: number; name: string; age: number }

// 使用：确保变量类型与函数返回值一致
const user: User = getUser()
```

---

### InstanceType\<Type\>

提取构造函数创建的**实例类型**。

```typescript
class Cat {
  name: string
  constructor(name: string) { this.name = name }
}

type CatInstance = InstanceType<typeof Cat>
// Cat

function createCat(name: string): CatInstance {
  return new Cat(name)
}
```

---

### ThisParameterType\<Type\>

提取函数中 `this` 参数的类型。

```typescript
function toHex(this: Number) {
  return this.toString(16)
}

type HexThis = ThisParameterType<typeof toHex>
// Number

// 使用：将 this 绑定到指定对象
function numberToString(n: HexThis) {
  return toHex.apply(n)
}
```

---

### OmitThisParameter\<Type\>

移除函数的 `this` 参数。

```typescript
function toHex(this: Number) {
  return this.toString(16)
}

// 移除 this 参数后，可以自由 bind
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5)
console.log(fiveToHex())  // '5'
```

---

### ThisType\<Type\>

标记上下文 `this` 的类型。需要配合 `noImplicitThis` 编译选项。

```typescript
type ObjectDescriptor<D, M> = {
  data?: D
  methods?: M & ThisType<D & M>  // this 类型为 D & M
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data = desc.data || {}
  let methods = desc.methods || {}
  return { ...data, ...methods } as D & M
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx  // this 类型为 { x: number; y: number } & { moveBy: ... }
      this.y += dy
    }
  }
})

obj.x = 10
obj.y = 20
obj.moveBy(5, 5)
```

---

### NoInfer\<Type\>

阻止类型推断向指定类型传播。

```typescript
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>  // defaultColor 的类型只能来自 colors 参数
) {
  // ...
}

// ✅ 正确：'red' 在 colors 数组中
createStreetLight(['red', 'yellow', 'green'], 'red')

// ❌ 错误：'blue' 不在 colors 数组中
createStreetLight(['red', 'yellow', 'green'], 'blue')
```

---

## 4. 字符串操作

### Uppercase\<StringType\>

将字符串转为大写。

```typescript
type T1 = Uppercase<'hello'>      // 'HELLO'
type T2 = Uppercase<'foo' | 'bar'> // 'FOO' | 'BAR'
```

### Lowercase\<StringType\>

将字符串转为小写。

```typescript
type T1 = Lowercase<'HELLO'>      // 'hello'
type T2 = Lowercase<'FOO' | 'BAR'> // 'foo' | 'bar'
```

### Capitalize\<StringType\>

将首字母大写。

```typescript
type T1 = Capitalize<'hello'>      // 'Hello'
type T2 = Capitalize<'foo' | 'bar'> // 'Foo' | 'Bar'
```

### Uncapitalize\<StringType\>

将首字母小写。

```typescript
type T1 = Uncapitalize<'Hello'>      // 'hello'
type T2 = Uncapitalize<'Foo' | 'Bar'> // 'foo' | 'bar'
```

### 实际应用：事件处理

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<'click'>     // 'onClick'
type FocusEvent = EventName<'focus'>     // 'onFocus'
type BlurEvent = EventName<'blur'>       // 'onBlur'
```

---

## 5. 其他实用类型

### Awaited\<Type\>

递归解包 Promise 类型（模拟 `await` 的行为）。

```typescript
type A = Awaited<Promise<string>>
// string

type B = Awaited<Promise<Promise<number>>>
// number  （递归解包）

type C = Awaited<boolean | Promise<number>>
// boolean | number
```

**应用场景**：泛型函数中获取异步操作的最终返回值。

```typescript
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json()
}

type Result = Awaited<ReturnType<typeof fetchData<{ name: string }>>>
// { name: string }
```

### `intrinsic` 字符串工具

TypeScript 内置的字符串操作类型，在模板字面量类型中非常强大：

```typescript
// 配合模板字面量类型使用
type Event<T extends string> = `on${Capitalize<T>}`
type ClickEvent = Event<'click'>  // 'onClick'

// 在条件类型中使用
type IsUppercase<S extends string> = Uppercase<S> extends S ? true : false
type A = IsUppercase<'HELLO'>  // true
type B = IsUppercase<'hello'>  // false
```

---

## 速查表

| 工具类型 | 作用 | 示例 |
|---------|------|------|
| `Partial<T>` | 所有属性可选 | `Partial<User>` |
| `Required<T>` | 所有属性必选 | `Required<Props>` |
| `Readonly<T>` | 所有属性只读 | `Readonly<Config>` |
| `Record<K,V>` | 构造键值映射 | `Record<string, number>` |
| `Pick<T,K>` | 选取指定键 | `Pick<Todo, 'title'>` |
| `Omit<T,K>` | 排除指定键 | `Omit<Todo, 'id'>` |
| `Exclude<T,U>` | 排除联合成员 | `Exclude<'a'\|'b', 'a'>` |
| `Extract<T,U>` | 提取联合成员 | `Extract<string\|number, number>` |
| `NonNullable<T>` | 排除 null/undefined | `NonNullable<string\|null>` |
| `Parameters<T>` | 提取函数参数 | `Parameters<typeof fn>` |
| `ConstructorParameters<T>` | 提取构造函数参数 | `ConstructorParameters<typeof C>` |
| `ReturnType<T>` | 提取返回类型 | `ReturnType<typeof fn>` |
| `InstanceType<T>` | 提取实例类型 | `InstanceType<typeof C>` |
| `Awaited<T>` | 解包 Promise | `Awaited<Promise<string>>` |
| `NoInfer<T>` | 阻止类型推断 | `NoInfer<C>` |
| `Uppercase<S>` | 字符串转大写 | `Uppercase<'hello'>` |
| `Lowercase<S>` | 字符串转小写 | `Lowercase<'HELLO'>` |
| `Capitalize<S>` | 首字母大写 | `Capitalize<'hello'>` |
| `Uncapitalize<S>` | 首字母小写 | `Uncapitalize<'Hello'>` |
| `ThisParameterType<T>` | 提取 this 类型 | `ThisParameterType<typeof fn>` |
| `OmitThisParameter<T>` | 移除 this 参数 | `OmitThisParameter<typeof fn>` |
| `ThisType<T>` | 标记 this 类型 | `M & ThisType<D & M>` |

---

## 综合案例：API 响应类型系统

以下示例展示如何组合使用多个内置工具类型构建完整的 API 类型系统：

```typescript
// 1. 定义基础类型
interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
}

// 2. Record: 构造 API 端点映射
type ApiEndpoints = Record<'getUser' | 'updateUser' | 'deleteUser', string>
const endpoints: ApiEndpoints = {
  getUser: '/api/users/:id',
  updateUser: '/api/users/:id',
  deleteUser: '/api/users/:id'
}

// 3. Pick + Omit: 创建安全的 DTO（数据传输对象）
type CreateUserDTO = Omit<User, 'id' | 'createdAt'>  // 排除服务端生成的字段
type UserResponse = Omit<User, 'password'>            // 排除敏感字段

// 4. Partial: 支持部分更新
type UpdateUserDTO = Partial<Omit<User, 'id' | 'createdAt'>>

// 5. Parameters + ReturnType: 提取函数签名
async function fetchUser(id: number): Promise<UserResponse> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

type FetchUserParams = Parameters<typeof fetchUser>  // [id: number]
type FetchUserReturn = ReturnType<typeof fetchUser>  // Promise<UserResponse>

// 6. Awaited: 解包 Promise 获取最终类型
type ActualUser = Awaited<ReturnType<typeof fetchUser>>  // UserResponse

// 7. Extract + Exclude: 过滤可选操作
type ReadOperations = 'getUser' | 'listUsers' | 'searchUsers'
type WriteOperations = 'createUser' | 'updateUser' | 'deleteUser'

type AllOperations = ReadOperations | WriteOperations
type SafeOperations = Exclude<AllOperations, 'deleteUser'>  // 排除危险操作
type ReadOnlyOps = Extract<AllOperations, ReadOperations>   // 只保留读操作

// 8. NonNullable: 处理可能为空的响应
function processResult(result: string | null | undefined): NonNullable<string | null | undefined> {
  return result ?? 'default'
}

// 9. ConstructorParameters + InstanceType: 工厂模式
class ApiClient {
  constructor(
    private baseUrl: string,
    private timeout: number
  ) {}
}

type ClientConfig = ConstructorParameters<typeof ApiClient>  // [baseUrl: string, timeout: number]
type ClientInstance = InstanceType<typeof ApiClient>          // ApiClient

// 10. 综合：类型安全的事件系统
type EventName<T extends string> = `on${Capitalize<T>}`
type EventHandler = (...args: any[]) => void

interface EventEmitter {
  [key: EventName<'click'>]: EventHandler
  [key: EventName<'focus'>]: EventHandler
}
```

---

## 小结

- **对象操作**：`Partial`、`Required`、`Readonly`、`Record`、`Pick`、`Omit` 是日常开发六大金刚
- **联合类型**：`Exclude` 和 `Extract` 用于精确过滤联合类型
- **函数操作**：`Parameters`、`ReturnType`、`InstanceType` 让你从函数/类中提取类型
- **异步**：`Awaited` 解决了 Promise 嵌套的类型提取问题
- **字符串**：`Uppercase`、`Capitalize` 等配合模板字面量类型可以做很多编译时字符串操作
- **组合使用**：这些类型可以嵌套组合，构建出复杂而精确的类型系统

掌握这些内置工具类型后，大部分场景都能覆盖。只有当内置类型不够用时，才需要引入 type-fest 这类第三方库。
