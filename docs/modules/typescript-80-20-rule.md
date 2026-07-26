# TypeScript 日常开发 80/20 法则

> 掌握这 20% 的核心特性，解决日常开发中 80% 的问题。本文档基于实际项目经验，聚焦最常用、最实用的 TypeScript 特性。

## 核心理念

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   20% 的核心特性 ──→ 解决 80% 的日常问题               │
│                                                         │
│   • 基础类型 + 接口     → 定义数据结构                   │
│   • 泛型               → 创建可复用的类型安全代码        │
│   • 联合类型 + 类型守卫 → 处理多种类型                   │
│   • async/await        → 异步操作                       │
│   • 工具类型           → 变换现有类型                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 1. 基础类型（必须掌握）

### 原始类型

```typescript
let name: string = 'Alice'      // 字符串
let age: number = 30            // 数字
let active: boolean = true      // 布尔
const id: symbol = Symbol('id') // 唯一标识
```

### 对象类型

```typescript
// 接口：定义对象结构
interface User {
  id: number
  name: string
  email?: string  // 可选
}

// 类型别名：更灵活
type ID = string | number
type Status = 'active' | 'inactive' | 'deleted'
```

### 数组

```typescript
let numbers: number[] = [1, 2, 3]
let users: User[] = [{ id: 1, name: 'Alice', email: '' }]
```

### any vs unknown

```typescript
let a: any = 'hello'    // ❌ 不推荐：绕过类型检查
let b: unknown = 'hello' // ✅ 推荐：安全的 any

// unknown 必须检查才能使用
if (typeof b === 'string') {
  console.log(b.toUpperCase())  // ✅ 安全
}
```

---

## 2. 接口与类型（定义数据结构）

### 接口

```typescript
interface User {
  id: number
  name: string
  email?: string
  readonly createdAt: Date
}

interface Admin extends User {
  role: string
}
```

### 类型别名

```typescript
type ID = string | number
type Point = [number, number]
type Callback = () => void
type EventName = 'click' | 'scroll' | 'resize'
```

### 选择建议

| 场景 | 推荐 |
|------|------|
| 定义对象结构 | `interface` |
| 定义联合类型 | `type` |
| 定义元组 | `type` |
| 需要声明合并 | `interface` |
| 需要被类实现 | `interface` |

---

## 3. 泛型（类型安全的复用）

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
getProperty(user, 'age')   // number
```

### 实际应用

```typescript
// API 响应类型
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url)
  return res.json()
}

const user = await fetchData<User>('/api/user/1')
```

---

## 4. 联合类型 + 类型守卫（处理多种类型）

### 联合类型

```typescript
type ID = string | number
type Status = 'active' | 'inactive' | 'deleted'
type Result = { success: true; data: any } | { success: false; error: string }
```

### 类型守卫

```typescript
// typeof 守卫
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

// instanceof 守卫
class Bird { fly() {} }
class Fish { swim() {} }

function move(animal: Bird | Fish) {
  if (animal instanceof Bird) {
    animal.fly()
  } else {
    animal.swim()
  }
}

// 自定义类型守卫
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
```

### 实际应用

```typescript
// 类型安全的事件处理
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
  console.log(data.x, data.y)  // ✅ 类型安全
})
```

---

## 5. async/await（异步操作）

### 基本用法

```typescript
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

### 错误处理

```typescript
async function safeFetch(url: string): Promise<Response | null> {
  try {
    return await fetch(url)
  } catch (error) {
    console.error('请求失败:', error)
    return null
  }
}
```

### 并行执行

```typescript
// 串行（慢）
const user = await fetchUser(1)
const posts = await fetchPosts(1)

// 并行（快）
const [user, posts] = await Promise.all([
  fetchUser(1),
  fetchPosts(1)
])
```

---

## 6. 工具类型（变换现有类型）

### 最常用的 5 个

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
}

// Partial: 所有属性可选
type PartialUser = Partial<User>

// Pick: 选取指定键
type UserName = Pick<User, 'name' | 'email'>

// Omit: 排除指定键
type SafeUser = Omit<User, 'password'>

// Record: 构造键值映射
type CatMap = Record<'miffy' | 'boris', { age: number }>

// Readonly: 所有属性只读
type ReadonlyUser = Readonly<User>
```

### 实际应用

```typescript
// API DTO
type CreateUserDTO = Omit<User, 'id'>
type UpdateUserDTO = Partial<Omit<User, 'id'>>
type UserResponse = Omit<User, 'password'>
```

---

## 7. 常用模式（实战技巧）

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
  console.log(data.x, data.y)  // ✅ 类型安全
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

const user = await fetchApi('/users')  // { id: number; name: string }
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
```

---

## 速查表

| 特性 | 语法 | 使用频率 |
|------|------|----------|
| 类型注解 | `x: Type` | ⭐⭐⭐⭐⭐ |
| 接口 | `interface I {}` | ⭐⭐⭐⭐⭐ |
| 泛型 | `<T>` | ⭐⭐⭐⭐⭐ |
| 联合类型 | `A \| B` | ⭐⭐⭐⭐⭐ |
| async/await | `async function` | ⭐⭐⭐⭐⭐ |
| 工具类型 | `Partial<T>` | ⭐⭐⭐⭐ |
| 类型守卫 | `typeof x === 'string'` | ⭐⭐⭐⭐ |
| keyof | `keyof T` | ⭐⭐⭐ |
| 条件类型 | `T extends U ? X : Y` | ⭐⭐⭐ |
| infer | `infer T` | ⭐⭐ |

---

## 最佳实践

1. **开启 strict 模式**：更好的类型安全
2. **优先使用 unknown**：替代 any
3. **使用 interface 定义对象**：更好的扩展性
4. **使用泛型创建可复用组件**：类型安全的复用
5. **使用联合类型 + 类型守卫**：处理多种类型
6. **使用工具类型变换类型**：减少重复代码
7. **保持代码可读性**：不要过度使用类型
