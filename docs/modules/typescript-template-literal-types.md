# TypeScript 模板字面量类型完全指南

> 模板字面量类型（Template Literal Types）是 TypeScript 4.1 引入的强大特性，允许在类型层面进行字符串操作。它是构建类型安全 API 的利器。

## 目录

1. [什么是模板字面量类型](#1-什么是模板字面量类型)
2. [基本语法](#2-基本语法)
3. [联合类型与模板字面量](#3-联合类型与模板字面量)
4. [内置字符串操作类型](#4-内置字符串操作类型)
5. [高级模式](#5-高级模式)
6. [实战案例](#6-实战案例)

---

## 1. 什么是模板字面量类型

模板字面量类型允许在类型层面操作字符串，类似于 JavaScript 的模板字符串。

```typescript
// 基本模板字面量类型
type Name = 'Alice'
type Greeting = `Hello, ${Name}`
// 'Hello, Alice'
```

---

## 2. 基本语法

### 字符串拼接

```typescript
type A = 'hello'
type B = 'world'
type C = `${A} ${B}`  // 'hello world'
```

### 与类型组合

```typescript
type Prefix = 'get'
type Name = 'User'
type Method = `${Prefix}${Name}`  // 'getUser'

// 实际应用
interface Api {
  [key: `get${string}`]: () => any
}

const api: Api = {
  getUser: () => ({}),
  getPost: () => ({})
}
```

---

## 3. 联合类型与模板字面量

当模板字面量中使用联合类型时，会生成所有可能的组合。

### 基本组合

```typescript
type Color = 'red' | 'blue' | 'green'
type Size = 'sm' | 'md' | 'lg'

type ColorSize = `${Color}-${Size}`
// 'red-sm' | 'red-md' | 'red-lg' |
// 'blue-sm' | 'blue-md' | 'blue-lg' |
// 'green-sm' | 'green-md' | 'green-lg'
```

### 嵌套组合

```typescript
type A = 'x' | 'y'
type B = '1' | '2'
type C = 'a' | 'b'

type Result = `${A}-${B}-${C}`
// 'x-1-a' | 'x-1-b' | 'x-2-a' | 'x-2-b' |
// 'y-1-a' | 'y-1-b' | 'y-2-a' | 'y-2-b'
```

---

## 4. 内置字符串操作类型

### Uppercase\<S\>

```typescript
type T1 = Uppercase<'hello'>      // 'HELLO'
type T2 = Uppercase<'foo' | 'bar'> // 'FOO' | 'BAR'
```

### Lowercase\<S\>

```typescript
type T1 = Lowercase<'HELLO'>      // 'hello'
type T2 = Lowercase<'FOO' | 'BAR'> // 'foo' | 'bar'
```

### Capitalize\<S\>

```typescript
type T1 = Capitalize<'hello'>      // 'Hello'
type T2 = Capitalize<'foo' | 'bar'> // 'Foo' | 'Bar'
```

### Uncapitalize\<S\>

```typescript
type T1 = Uncapitalize<'Hello'>      // 'hello'
type T2 = Uncapitalize<'Foo' | 'Bar'> // 'foo' | 'bar'
```

---

## 5. 高级模式

### 事件名生成

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<'click'>     // 'onClick'
type FocusEvent = EventName<'focus'>     // 'onFocus'
type BlurEvent = EventName<'blur'>       // 'onBlur'
```

### CSS 类名生成

```typescript
type Margin = '0' | '1' | '2' | '3' | '4' | 'auto'
type MarginClass = `m-${Margin}`
// 'm-0' | 'm-1' | 'm-2' | 'm-3' | 'm-4' | 'm-auto'
```

### 路由路径

```typescript
type Id = string | number
type Route = `/users/${Id}` | `/posts/${Id}` | `/comments/${Id}`
```

---

## 6. 实战案例

### 案例 1：类型安全的事件系统

```typescript
type EventMap = {
  click: { x: number; y: number }
  keydown: { key: string }
  resize: { width: number; height: number }
}

type EventKey = keyof EventMap
type EventData<K extends EventKey> = EventMap[K]
type EventHandler<K extends EventKey> = (data: EventData<K>) => void

function on<K extends EventKey>(
  event: K,
  handler: EventHandler<K>
) {
  // 类型安全的事件处理
}

on('click', (data) => {
  console.log(data.x, data.y)  // 类型安全
})
```

### 案例 2：类型安全的 API

```typescript
interface ApiEndpoints {
  '/users': { id: number; name: string }
  '/posts': { id: number; title: string }
  '/comments': { id: number; body: string }
}

type Endpoint = keyof ApiEndpoints
type Response<T extends Endpoint> = ApiEndpoints[T]

async function fetchApi<T extends Endpoint>(
  endpoint: T
): Promise<Response<T>> {
  const response = await fetch(endpoint)
  return response.json()
}

const user = await fetchApi('/users')  // { id: number; name: string }
```

### 案例 3：CSS 变量系统

```typescript
type Spacing = '0' | '1' | '2' | '3' | '4' | '5' | '6'
type Direction = 't' | 'r' | 'b' | 'l' | 'x' | 'y'

type Margin = `m-${Direction}-${Spacing}`
type Padding = `p-${Direction}-${Spacing}`

// margin-top-4, padding-x-2 等
```

---

## 小结

| 特性 | 语法 | 说明 |
|------|------|------|
| 基本拼接 | `` `${A}${B}` `` | 字符串拼接 |
| 联合组合 | `` `${Color}-${Size}` `` | 生成所有组合 |
| Capitalize | `Capitalize<S>` | 首字母大写 |
| Uppercase | `Uppercase<S>` | 转大写 |
| Lowercase | `Lowercase<S>` | 转小写 |

**最佳实践**：
- 使用模板字面量类型生成事件名、路由等
- 配合联合类型生成所有可能的组合
- 使用内置字符串操作类型进行转换
- 注意字符串组合可能导致的类型爆炸
