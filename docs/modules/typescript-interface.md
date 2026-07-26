# TypeScript Interface 完全指南

> Interface（接口）是 TypeScript 的核心特性之一，用于定义对象的结构和契约。它是实现"鸭式辨型法"（结构化类型系统）的基础。

## 目录

1. [什么是 Interface](#1-什么是-interface)
2. [基础语法](#2-基础语法)
3. [属性修饰符](#3-属性修饰符)
4. [函数类型接口](#4-函数类型接口)
5. [接口继承](#5-接口继承)
6. [接口实现（implements）](#6-接口实现implements)
7. [索引签名](#7-索引签名)
8. [声明合并](#8-声明合并)
9. [接口与类的关系](#9-接口与类的关系)
10. [实战案例](#10-实战案例)

---

## 1. 什么是 Interface

Interface 是对对象结构的**契约定义**。它描述了一个对象"应该长什么样"，但不包含具体实现。

```typescript
// 定义一个接口
interface User {
  id: number
  name: string
  email: string
}

// 使用接口：对象必须符合这个结构
const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
}

// ❌ 缺少属性会报错
const user2: User = { id: 2, name: 'Bob' }
// 报错：缺少 email 属性
```

---

## 2. 基础语法

### 定义接口

```typescript
interface Person {
  firstName: string
  lastName: string
  age: number
}
```

### 使用接口

```typescript
// 方式一：直接标注类型
const person: Person = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30
}

// 方式二：函数参数标注
function greet(person: Person): string {
  return `Hello, ${person.firstName} ${person.lastName}`
}
```

### 接口描述函数类型

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean
}

// 使用
const mySearch: SearchFunc = function(src, sub) {
  let result = src.search(sub)
  return result > -1
}
```

---

## 3. 属性修饰符

### 可选属性（?）

属性名后加 `?` 表示该属性可以不存在。

```typescript
interface User {
  id: number
  name: string
  email?: string    // 可选
  phone?: string    // 可选
}

// ✅ 正确
const user1: User = { id: 1, name: 'Alice' }

// ✅ 正确
const user2: User = { id: 2, name: 'Bob', email: 'bob@example.com' }
```

### 只读属性（readonly）

属性前加 `readonly` 表示该属性只能在创建时赋值，之后不可修改。

```typescript
interface Config {
  readonly host: string
  readonly port: number
}

const config: Config = { host: 'localhost', port: 3000 }
config.host = 'example.com'  // ❌ 报错：只读属性不能修改
```

### 属性修饰符对比

| 修饰符 | 作用 | 示例 |
|--------|------|------|
| 无 | 必选属性 | `name: string` |
| `?` | 可选属性 | `age?: number` |
| `readonly` | 只读属性 | `id: number` |

---

## 4. 函数类型接口

### 函数签名

```typescript
interface MathOperation {
  (a: number, b: number): number
}

const add: MathOperation = (a, b) => a + b
const multiply: MathOperation = (a, b) => a * b
```

### 带属性的对象方法

```typescript
interface Counter {
  count: number
  increment(): void
  decrement(): void
  reset(): void
}

function createCounter(): Counter {
  let count = 0
  return {
    count,
    increment() { this.count++ },
    decrement() { this.count-- },
    reset() { this.count = 0 }
  }
}
```

---

## 5. 接口继承

### 单继承

使用 `extends` 关键字继承一个接口。

```typescript
interface Animal {
  name: string
  age: number
}

interface Dog extends Animal {
  breed: string
  bark(): void
}

// Dog 必须包含 Animal 的所有属性
const dog: Dog = {
  name: 'Rex',
  age: 3,
  breed: 'German Shepherd',
  bark() { console.log('Woof!') }
}
```

### 多继承

一个接口可以继承多个接口。

```typescript
interface Shape {
  color: string
}

interface PenStroke {
  penWidth: number
}

interface Square extends Shape, PenStroke {
  sideLength: number
}

// Square 包含 Shape、PenStroke 和自身的所有属性
const square: Square = {
  color: 'blue',
  penWidth: 5,
  sideLength: 10
}
```

### 继承链

```typescript
interface Living {
  alive: boolean
}

interface Being extends Living {
  name: string
}

interface Person extends Being {
  age: number
}

// Person 包含所有层级的属性
const person: Person = {
  alive: true,
  name: 'Alice',
  age: 30
}
```

---

## 6. 接口实现（implements）

类可以实现一个或多个接口，必须提供接口中定义的所有方法和属性。

### 基本实现

```typescript
interface Printable {
  print(): void
}

interface Loggable {
  log(message: string): void
}

class Document implements Printable, Loggable {
  constructor(public title: string) {}

  print() {
    console.log(`打印: ${this.title}`)
  }

  log(message: string) {
    console.log(`[${this.title}] ${message}`)
  }
}
```

### 实际应用：插件系统

```typescript
interface Plugin {
  name: string
  version: string
  init(): void
  destroy(): void
}

class MyPlugin implements Plugin {
  name = 'my-plugin'
  version = '1.0.0'

  init() {
    console.log('插件初始化')
  }

  destroy() {
    console.log('插件销毁')
  }
}
```

---

## 7. 索引签名

当不确定对象会有多少个属性时，使用索引签名。

### 字符串索引签名

```typescript
interface StringArray {
  [index: string]: string
}

const colors: StringArray = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff'
}
```

### 数字索引签名

```typescript
interface NumberMap {
  [index: number]: string
}

const arr: NumberMap = ['a', 'b', 'c']
console.log(arr[0])  // 'a'
```

### 混合签名

```typescript
interface Dictionary {
  [key: string]: any
  length: number  // 显式定义的属性
}

const dict: Dictionary = {
  name: 'Alice',
  age: 30,
  length: 2
}
```

### 索引签名的约束

```typescript
interface Config {
  [key: string]: string  // 索引签名的值类型是 string
  name: string           // ✅ 兼容
  // age: number          // ❌ 报错：number 不兼容 string
}
```

---

## 8. 声明合并

Interface 支持**声明合并**：多个同名接口会自动合并。

### 基本合并

```typescript
interface User {
  name: string
}

interface User {
  age: number
}

// 合并后相当于：
// interface User {
//   name: string
//   age: number
// }

const user: User = { name: 'Alice', age: 30 }  // ✅
```

### 与库合并

TypeScript 使用声明合并为已有类型添加属性：

```typescript
// 为 Window 接口添加自定义属性
interface Window {
  myCustomProperty: string
}

// 现在可以使用
window.myCustomProperty = 'hello'
```

### 合并规则

```typescript
interface A {
  x: number
  y: number
}

interface A {
  z: number
  y: string  // ❌ 报错：y 的类型冲突（number vs string）
}

// ✅ 正确：方法重载
interface Calculator {
  add(a: number, b: number): number
}

interface Calculator {
  add(a: string, b: string): string
}
```

---

## 9. 接口与类的关系

### 接口作为契约

```typescript
interface Repository<T> {
  findById(id: string): T | null
  findAll(): T[]
  save(entity: T): void
  delete(id: string): boolean
}

// 类必须实现接口的所有方法
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

### 接口继承类

```typescript
class Control {
  private state: any
}

interface SelectableControl extends Control {
  select(): void
}

class Button extends Control implements SelectableControl {
  select() { console.log('Button selected') }
}
```

---

## 10. 实战案例

### 案例 1：API 响应类型

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
  email: string
}

// 使用泛型接口
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

const response = await fetchUser(1)
console.log(response.data.name)  // 类型安全
```

### 案例 2：事件系统

```typescript
interface EventMap {
  click: { x: number; y: number }
  keydown: { key: string; code: string }
  resize: { width: number; height: number }
}

class EventEmitter<T extends Record<string, any>> {
  private listeners: { [K in keyof T]?: Array<(data: T[K]) => void> } = {}

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(listener)
  }

  emit<K extends keyof T>(event: K, data: T[K]) {
    this.listeners[event]?.forEach(fn => fn(data))
  }
}

const emitter = new EventEmitter<EventMap>()
emitter.on('click', (data) => {
  console.log(data.x, data.y)  // 类型安全
})
```

### 案例 3：配置对象

```typescript
interface DatabaseConfig {
  host: string
  port: number
  username?: string
  password?: string
  database: string
  ssl?: boolean
  pool?: {
    min: number
    max: number
  }
}

function createDatabase(config: DatabaseConfig) {
  const { host, port, database, ssl = false, pool = { min: 2, max: 10 } } = config
  console.log(`连接到 ${host}:${port}/${database}`)
}

createDatabase({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  pool: { min: 5, max: 20 }
})
```

---

## 小结

| 特性 | 说明 |
|------|------|
| 定义对象结构 | 描述对象"应该长什么样" |
| 可选属性 | `?` 标记可选 |
| 只读属性 | `readonly` 标记只读 |
| 继承 | `extends` 继承其他接口 |
| 实现 | `implements` 被类实现 |
| 索引签名 | `[key: string]: Type` |
| 声明合并 | 同名接口自动合并 |

**最佳实践**：
- 定义对象结构时优先使用 `interface`
- 需要扩展时使用 `interface`（支持 `extends`）
- 需要声明合并时使用 `interface`
- 公开的 API 定义使用 `interface`
