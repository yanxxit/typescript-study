# TypeScript 类型守卫完全指南

> 类型守卫（Type Guards）是 TypeScript 中用于在运行时检查类型的技术，它允许你在特定代码块中缩窄（narrow）变量的类型范围。

## 目录

1. [什么是类型守卫](#1-什么是类型守卫)
2. [typeof 守卫](#2-typeof-守卫)
3. [instanceof 守卫](#3-instanceof-守卫)
4. [in 守卫](#4-in-守卫)
5. [真值检查](#5-真值检查)
6. [自定义类型守卫](#6-自定义类型守卫)
7. [断言函数](#7-断言函数)
8. [可辨识联合](#8-可辨识联合)
9. [穷尽检查](#9-穷尽检查)
10. [实战案例](#10-实战案例)

---

## 1. 什么是类型守卫

类型守卫是在**运行时**检查类型，让 TypeScript 能够在特定代码块中推断出更精确的类型。

```typescript
function processValue(value: string | number) {
  // 此时 value 是 string | number
  if (typeof value === 'string') {
    // 此时 value 是 string
    return value.toUpperCase()
  } else {
    // 此时 value 是 number
    return value.toFixed(2)
  }
}
```

---

## 2. typeof 守卫

使用 `typeof` 运算符检查原始类型。

### 基本用法

```typescript
function format(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return value.toUpperCase()  // string
  } else if (typeof value === 'number') {
    return value.toFixed(2)     // number
  } else {
    return value ? '是' : '否'  // boolean
  }
}
```

### typeof 的返回值

| 类型 | typeof 返回值 |
|------|--------------|
| `string` | `'string'` |
| `number` | `'number'` |
| `boolean` | `'boolean'` |
| `undefined` | `'undefined'` |
| `function` | `'function'` |
| `object` | `'object'` |
| `symbol` | `'symbol'` |
| `bigint` | `'bigint'` |

### 实际应用

```typescript
function padLeft(value: string, padding: string | number): string {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + value
  }
  return padding + value
}
```

---

## 3. instanceof 守卫

使用 `instanceof` 检查对象是否是某个类的实例。

### 基本用法

```typescript
class Bird {
  fly() { console.log('飞翔') }
  layEggs() { console.log('下蛋') }
}

class Fish {
  swim() { console.log('游泳') }
  layEggs() { console.log('下蛋') }
}

function move(animal: Bird | Fish) {
  if (animal instanceof Bird) {
    animal.fly()    // Bird
  } else {
    animal.swim()   // Fish
  }
}
```

### 实际应用

```typescript
class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
  }
}

class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message)
  }
}

function handleError(error: Error) {
  if (error instanceof HttpError) {
    console.log(`HTTP ${error.statusCode}: ${error.message}`)
  } else if (error instanceof ValidationError) {
    console.log(`验证错误 ${error.field}: ${error.message}`)
  } else {
    console.log(`未知错误: ${error.message}`)
  }
}
```

---

## 4. in 守卫

使用 `in` 运算符检查对象是否拥有某个属性。

### 基本用法

```typescript
interface Admin {
  name: string
  privileges: string[]
}

interface Employee {
  name: string
  startDate: Date
}

type UnknownEmployee = Employee | Admin

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name: ' + emp.name)

  if ('privileges' in emp) {
    console.log('Privileges: ' + emp.privileges)  // Admin
  }

  if ('startDate' in emp) {
    console.log('Start Date: ' + emp.startDate)   // Employee
  }
}
```

### 实际应用

```typescript
interface Circle {
  kind: 'circle'
  radius: number
}

interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}

type Shape = Circle | Rectangle

function area(shape: Shape): number {
  if ('radius' in shape) {
    return Math.PI * shape.radius ** 2  // Circle
  }
  return shape.width * shape.height     // Rectangle
}
```

---

## 5. 真值检查

利用 JavaScript 的真值/假值进行类型缩窄。

### 基本用法

```typescript
function process(value: string | null | undefined) {
  if (value) {
    // value 是 string（排除了 null 和 undefined）
    return value.toUpperCase()
  }
  return '默认值'
}
```

### 注意事项

```typescript
function process(value: string | number | null) {
  if (value) {
    // value 是 string | number（排除了 null）
    // 注意：0 和 '' 也会被排除！
  }

  // 更安全的写法
  if (value !== null && value !== undefined) {
    // value 是 string | number
  }
}
```

---

## 6. 自定义类型守卫

使用**类型谓词**（Type Predicate）创建自定义的类型守卫函数。

### 类型谓词语法

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase())  // string
  }
}
```

### 实际应用

```typescript
interface Fish {
  name: string
  swim: () => void
}

interface Bird {
  name: string
  fly: () => void
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim()  // Fish
  } else {
    pet.fly()   // Bird
  }
}
```

### 类型谓词的优势

```typescript
// 没有类型谓词
function isNumber(value: unknown): boolean {
  return typeof value === 'number'
}

// 有类型谓词
function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

// 使用
const value: unknown = 42
if (isNumber(value)) {
  // 没有类型谓词：value 仍然是 unknown
  // console.log(value.toFixed(2))  // ❌ 错误

  // 有类型谓词：value 是 number
  console.log(value.toFixed(2))     // ✅ 正确
}
```

---

## 7. 断言函数

断言函数在条件不满足时抛出错误，成功时返回 void。

### 基本用法

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('期望字符串类型')
  }
}

function process(value: unknown) {
  assertIsString(value)
  // value 在这里是 string
  console.log(value.toUpperCase())
}
```

### 实际应用

```typescript
function assertDefined<T>(value: T | null | undefined, name: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name} 不能为空`)
  }
}

function processUser(user: { name?: string | null }) {
  assertDefined(user.name, 'name')
  // user.name 在这里是 string
  console.log(user.name.toUpperCase())
}
```

---

## 8. 可辨识联合

使用共同的**判别字段**（Discriminant）区分联合类型中的不同成员。

### 基本用法

```typescript
interface Circle {
  kind: 'circle'    // 判别字段
  radius: number
}

interface Rectangle {
  kind: 'rectangle' // 判别字段
  width: number
  height: number
}

interface Triangle {
  kind: 'triangle'  // 判别字段
  base: number
  height: number
}

type Shape = Circle | Rectangle | Triangle

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

### 实际应用

```typescript
interface Request {
  type: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
}

interface GetRequest extends Request {
  type: 'GET'
  params: Record<string, string>
}

interface PostRequest extends Request {
  type: 'POST'
  body: any
}

type ApiRequest = GetRequest | PostRequest

function sendRequest(request: ApiRequest) {
  switch (request.type) {
    case 'GET':
      console.log(`GET ${request.url}`, request.params)  // GetRequest
      break
    case 'POST':
      console.log(`POST ${request.url}`, request.body)    // PostRequest
      break
  }
}
```

---

## 9. 穷尽检查

确保联合类型的所有情况都被处理。

### 使用 never 进行穷尽检查

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'rectangle':
      return shape.width * shape.height
    default:
      // 如果漏掉了某个 case，这里会报错
      const _exhaustive: never = shape
      return _exhaustive
  }
}
```

### 添加新类型时的提示

```typescript
// 如果添加新的 Shape 类型
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number }  // 新增

// switch 中没有处理 triangle 时，default 会报错
// Type '{ kind: "triangle"; base: number; height: number; }' is not assignable to type 'never'
```

---

## 10. 实战案例

### 案例 1：API 响应处理

```typescript
interface SuccessResponse {
  status: 'success'
  data: any
}

interface ErrorResponse {
  status: 'error'
  message: string
  code: number
}

type ApiResponse = SuccessResponse | ErrorResponse

function handleResponse(response: ApiResponse) {
  if (response.status === 'success') {
    console.log('数据:', response.data)  // SuccessResponse
  } else {
    console.error(`错误 ${response.code}: ${response.message}`)  // ErrorResponse
  }
}
```

### 案例 2：JSON 解析验证

```typescript
interface User {
  id: number
  name: string
  email: string
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  )
}

function parseUser(json: string): User | null {
  try {
    const data = JSON.parse(json)
    if (isUser(data)) {
      return data  // User
    }
    return null
  } catch {
    return null
  }
}
```

### 案例 3：事件处理

```typescript
interface MouseEvent {
  type: 'click'
  x: number
  y: number
}

interface KeyboardEvent {
  type: 'keydown'
  key: string
  code: string
}

interface ScrollEvent {
  type: 'scroll'
  scrollY: number
}

type AppEvent = MouseEvent | KeyboardEvent | ScrollEvent

function handleEvent(event: AppEvent) {
  switch (event.type) {
    case 'click':
      console.log(`点击位置: (${event.x}, ${event.y})`)
      break
    case 'keydown':
      console.log(`按键: ${event.key}`)
      break
    case 'scroll':
      console.log(`滚动位置: ${event.scrollY}`)
      break
  }
}
```

### 案例 4：表单验证

```typescript
interface FieldError {
  type: 'error'
  field: string
  message: string
}

interface FieldSuccess {
  type: 'success'
  field: string
  value: any
}

type FieldResult = FieldError | FieldSuccess

function processField(result: FieldResult) {
  if (result.type === 'error') {
    console.error(`${result.field}: ${result.message}`)
    return null
  }
  return result.value
}

function validateEmail(email: string): FieldResult {
  if (!email.includes('@')) {
    return { type: 'error', field: 'email', message: '邮箱格式不正确' }
  }
  return { type: 'success', field: 'email', value: email }
}

function validateAge(age: number): FieldResult {
  if (age < 0 || age > 150) {
    return { type: 'error', field: 'age', message: '年龄不合法' }
  }
  return { type: 'success', field: 'age', value: age }
}
```

---

## 小结

| 守卫类型 | 语法 | 适用场景 |
|----------|------|----------|
| `typeof` | `typeof x === 'string'` | 原始类型检查 |
| `instanceof` | `x instanceof Class` | 类实例检查 |
| `in` | `'prop' in obj` | 属性存在性检查 |
| 真值检查 | `if (x)` | 排除 null/undefined |
| 自定义守卫 | `x is Type` | 复杂类型判断 |
| 断言函数 | `asserts x is Type` | 前置条件验证 |
| 可辨识联合 | `switch (x.kind)` | 多类型分支处理 |

**最佳实践**：
- 优先使用 `typeof`、`instanceof`、`in` 等内置守卫
- 复杂类型判断使用自定义类型守卫
- 使用可辨识联合让类型更清晰
- 使用 `never` 进行穷尽检查
- 避免滥用类型断言（`as`）
