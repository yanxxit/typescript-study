# TypeScript Type 完全指南

> Type（类型别名）是 TypeScript 中用于给类型起新名字的工具。它比 Interface 更灵活，可以定义联合类型、元组、映射类型等复杂类型。

## 目录

1. [什么是 Type](#1-什么是-type)
2. [基础语法](#2-基础语法)
3. [联合类型](#3-联合类型)
4. [交叉类型](#4-交叉类型)
5. [元组类型](#5-元组类型)
6. [映射类型](#6-映射类型)
7. [条件类型](#7-条件类型)
8. [模板字面量类型](#8-模板字面量类型)
9. [Type vs Interface](#9-type-vs-interface)
10. [实战案例](#10-实战案例)

---

## 1. 什么是 Type

Type 是类型的**别名**，可以给任何类型起一个新名字。

```typescript
// 给原始类型起别名
type ID = string | number
type Callback = () => void

// 使用
let userId: ID = 123
let onClick: Callback = () => console.log('clicked')
```

---

## 2. 基础语法

### 定义类型别名

```typescript
// 对象类型
type User = {
  id: number
  name: string
  email: string
}

// 使用
const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
}
```

### 类型参数（泛型）

```typescript
type Box<T> = {
  value: T
}

// 使用
type NumberBox = Box<number>
type StringBox = Box<string>

const numBox: NumberBox = { value: 42 }
const strBox: StringBox = { value: 'hello' }
```

---

## 3. 联合类型

使用 `|` 表示"或"关系。

### 基本联合类型

```typescript
type ID = string | number

let userId: ID = 123    // ✅
userId = 'abc'          // ✅
// userId = true         // ❌
```

### 字面量联合类型

```typescript
type Direction = 'up' | 'down' | 'left' | 'right'
type HttpStatus = 200 | 301 | 404 | 500

function move(direction: Direction) {
  console.log(`向${direction}移动`)
}

move('up')    // ✅
// move('forward')  // ❌
```

### 联合类型的应用

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'rectangle':
      return shape.width * shape.height
    case 'triangle':
      return (shape.base * shape.height) / 2
  }
}
```

---

## 4. 交叉类型

使用 `&` 表示"且"关系，合并多个类型。

### 基本交叉类型

```typescript
type Person = {
  name: string
  age: number
}

type Employee = {
  company: string
  position: string
}

type EmployeePerson = Person & Employee

// 等同于：
// {
//   name: string
//   age: number
//   company: string
//   position: string
// }
```

### 交叉类型的注意事项

```typescript
type A = { x: number }
type B = { x: string }

type C = A & B
// { x: never }  // x 同时是 number 和 string，只能是 never
```

---

## 5. 元组类型

元组是**固定长度**和**固定类型**的数组。

### 基本元组

```typescript
type Point = [number, number]

const point: Point = [10, 20]  // ✅
// const point2: Point = [10, 20, 30]  // ❌ 长度不对
// const point3: Point = [10, '20']    // ❌ 类型不对
```

### 可选元素的元组

```typescript
type HttpResponse = [number, string, string?]

const ok: HttpResponse = [200, 'OK']           // ✅
const notFound: HttpResponse = [404, 'Not Found', 'Page not found']  // ✅
```

### 只读元组

```typescript
type readonlyPoint = readonly [number, number]

const point: readonlyPoint = [10, 20]
// point[0] = 30  // ❌ 只读元组不能修改
```

### 元组的使用场景

```typescript
// React useState 返回类型
type useState<T> = [T, (newValue: T) => void]

// 坐标系统
type Coordinate = [number, number, number?]  // x, y, z

// 键值对
type KeyValuePair<K, V> = [K, V]
```

---

## 6. 映射类型

遍历已有类型的键，创建新类型。

### 基本映射类型

```typescript
type User = {
  id: number
  name: string
  email: string
}

// 将所有属性变为可选
type PartialUser = {
  [K in keyof User]?: User[K]
}

// 将所有属性变为只读
type ReadonlyUser = {
  readonly [K in keyof User]: User[K]
}
```

### 常用映射类型

```typescript
// 只读版本
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

// 部分可选版本
type Partial<T> = {
  [K in keyof T]?: T[K]
}

// 必选版本
type Required<T> = {
  [K in keyof T]-?: T[K]
}
```

### 键重映射（as）

```typescript
type User = {
  id: number
  name: string
  email: string
}

// 给所有键添加 get 前缀
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

type UserGetters = Getters<User>
// {
//   getId: () => number
//   getName: () => string
//   getEmail: () => string
// }
```

---

## 7. 条件类型

根据条件选择不同的类型。

### 基本条件类型

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>   // true
type B = IsString<number>   // false
```

### infer 关键字

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Fn = () => string
type Result = ReturnType<Fn>  // string
```

### 条件类型的分发

```typescript
type ToArray<T> = T extends any ? T[] : never

type StrOrNum = string | number
type StrOrNumArray = ToArray<StrOrNum>  // string[] | number[]
```

### 内置条件类型

```typescript
// Exclude: 从联合类型中排除
type T1 = Exclude<'a' | 'b' | 'c', 'a'>  // 'b' | 'c'

// Extract: 从联合类型中提取
type T2 = Extract<'a' | 'b' | 'c', 'a' | 'f'>  // 'a'

// NonNullable: 排除 null 和 undefined
type T3 = NonNullable<string | null | undefined>  // string
```

---

## 8. 模板字面量类型

使用模板字符串语法创建字符串字面量类型。

### 基本模板字面量

```typescript
type Color = 'red' | 'blue' | 'green'
type Size = 'sm' | 'md' | 'lg'

type ColorSize = `${Color}-${Size}`
// 'red-sm' | 'red-md' | 'red-lg' |
// 'blue-sm' | 'blue-md' | 'blue-lg' |
// 'green-sm' | 'green-md' | 'green-lg'
```

### 配合 Uppercase 等工具

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<'click'>     // 'onClick'
type FocusEvent = EventName<'focus'>     // 'onFocus'
```

### 实际应用：CSS 类名

```typescript
type Margin = '0' | '1' | '2' | '3' | '4' | 'auto'
type MarginClass = `m-${Margin}`
// 'm-0' | 'm-1' | 'm-2' | 'm-3' | 'm-4' | 'm-auto'
```

---

## 9. Type vs Interface

### 主要区别

| 特性 | Interface | Type |
|------|-----------|------|
| 对象类型 | ✅ | ✅ |
| 联合类型 | ❌ | ✅ |
| 交叉类型 | ❌（用 extends） | ✅ |
| 元组 | ❌ | ✅ |
| 映射类型 | ❌ | ✅ |
| 条件类型 | ❌ | ✅ |
| 声明合并 | ✅ | ❌ |
| 实现类 | ✅ | ❌ |

### 使用建议

```typescript
// ✅ 推荐使用 interface
interface User {
  id: number
  name: string
}

interface UserRepository {
  findById(id: string): User | null
  save(user: User): void
}

// ✅ 推荐使用 type
type ID = string | number
type Point = [number, number]
type Status = 'active' | 'inactive' | 'deleted'
type Callback = () => void
type Optional<T> = { [K in keyof T]?: T[K] }
```

### 选择原则

- **定义对象结构** → `interface`
- **需要声明合并** → `interface`
- **需要被类实现** → `interface`
- **联合类型、元组** → `type`
- **映射类型、条件类型** → `type`
- **简单类型别名** → `type`

---

## 10. 实战案例

### 案例 1：状态机

```typescript
type State = 'idle' | 'loading' | 'success' | 'error'

type StateMessage = {
  idle: { type: 'idle' }
  loading: { type: 'loading'; progress: number }
  success: { type: 'success'; data: any }
  error: { type: 'error'; message: string }
}

type StateHandler<S extends State> = {
  onEnter?: () => void
  onExit?: () => void
  render: (message: StateMessage[S]) => string
}
```

### 案例 2：路由系统

```typescript
type Route = `/api/${string}`
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type Endpoint = {
  method: HttpMethod
  path: Route
  handler: () => any
}

function createEndpoint<M extends HttpMethod>(
  method: M,
  path: Route,
  handler: () => any
): Endpoint {
  return { method, path, handler }
}

const endpoint = createEndpoint('GET', '/api/users', () => [])
```

### 案例 3：深层 Partial

```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

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

// 所有属性（包括嵌套）都变为可选
type PartialConfig = DeepPartial<Config>

const config: PartialConfig = {
  db: {
    host: 'localhost'
    // 其他都可选
  }
}
```

### 案例 4：类型安全的事件系统

```typescript
type EventMap = {
  click: { x: number; y: number }
  keydown: { key: string }
  resize: { width: number; height: number }
}

type EventKey = keyof EventMap
type EventData<K extends EventKey> = EventMap[K]

class TypedEventEmitter {
  private listeners: Map<string, Function[]> = new Map()

  on<K extends EventKey>(event: K, listener: (data: EventData<K>) => void) {
    const list = this.listeners.get(event) || []
    list.push(listener)
    this.listeners.set(event, list)
  }

  emit<K extends EventKey>(event: K, data: EventData<K>) {
    this.listeners.get(event)?.forEach(fn => fn(data))
  }
}

const emitter = new TypedEventEmitter()
emitter.on('click', (data) => {
  console.log(data.x, data.y)  // 类型安全
})
```

---

## 小结

| 特性 | Type | Interface |
|------|------|-----------|
| 基本对象类型 | ✅ | ✅ |
| 联合类型 | ✅ `A \| B` | ❌ |
| 交叉类型 | ✅ `A & B` | ✅ `extends` |
| 元组 | ✅ `[A, B]` | ❌ |
| 映射类型 | ✅ `{ [K in T]: V }` | ❌ |
| 条件类型 | ✅ `T extends U ? X : Y` | ❌ |
| 声明合并 | ❌ | ✅ |
| 被类实现 | ❌ | ✅ |

**最佳实践**：
- 定义对象结构时优先使用 `interface`
- 需要联合、元组、映射等复杂类型时使用 `type`
- 保持项目内的一致性
- 两者大部分场景可以互换，选择你习惯的即可
