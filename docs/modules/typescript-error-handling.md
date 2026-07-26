# TypeScript 错误处理完全指南

> 错误处理是编写健壮 TypeScript 代码的关键。掌握 try/catch、自定义错误、类型守卫等技术，让你的应用更加可靠。

## 目录

1. [错误类型概述](#1-错误类型概述)
2. [try/catch 基础](#2-trycatch-基础)
3. [自定义错误类](#3-自定义错误类)
4. [错误类型守卫](#4-错误类型守卫)
5. [Promise 错误处理](#5-promise-错误处理)
6. [async/await 错误处理](#6-asyncawait-错误处理)
7. [Result 模式](#7-result-模式)
8. [错误边界](#8-错误边界)
9. [实战案例](#9-实战案例)

---

## 1. 错误类型概述

### JavaScript 内置错误类型

| 错误类型 | 说明 |
|----------|------|
| `Error` | 基础错误类型 |
| `TypeError` | 类型错误 |
| `RangeError` | 范围错误 |
| `ReferenceError` | 引用错误 |
| `SyntaxError` | 语法错误 |
| `URIError` | URI 错误 |

### TypeScript 的处理

```typescript
// TypeScript 不会阻止抛出任何错误
function riskyOperation() {
  throw new Error('出错了')  // ✅ 允许
  throw 42                    // ✅ 也允许（但不推荐）
  throw 'error'               // ✅ 也允许（但不推荐）
}

// 推荐：始终抛出 Error 实例
function safeOperation() {
  throw new TypeError('类型错误')
  throw new RangeError('范围错误')
}
```

---

## 2. try/catch 基础

### 基本语法

```typescript
try {
  // 可能出错的代码
  const result = JSON.parse('{"name": "Alice"}')
  console.log(result.name)
} catch (error) {
  // 处理错误
  console.error('解析失败:', error)
} finally {
  // 无论成功失败都执行
  console.log('清理资源')
}
```

### TypeScript 中的 catch

```typescript
// TypeScript 5.0+：catch 变量默认为 unknown
try {
  riskyOperation()
} catch (error) {
  // error 是 unknown 类型
  // 需要类型检查才能安全使用
  if (error instanceof Error) {
    console.log(error.message)  // ✅ 安全
  }
}

// 旧版本：error 是 any
try {
  riskyOperation()
} catch (error: any) {
  console.log(error.message)  // 不推荐
}
```

### 类型缩窄

```typescript
function handleError(error: unknown): string {
  // 使用类型守卫缩窄类型
  if (error instanceof TypeError) {
    return `类型错误: ${error.message}`
  }

  if (error instanceof RangeError) {
    return `范围错误: ${error.message}`
  }

  if (error instanceof Error) {
    return `错误: ${error.message}`
  }

  return `未知错误: ${String(error)}`
}
```

---

## 3. 自定义错误类

### 基本自定义错误

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// 使用
throw new AppError('用户不存在', 'USER_NOT_FOUND', 404)
```

### 带元数据的错误

```typescript
interface ErrorMetadata {
  timestamp: Date
  requestId?: string
  userId?: string
}

class DetailedError extends Error {
  constructor(
    message: string,
    public metadata: ErrorMetadata
  ) {
    super(message)
    this.name = 'DetailedError'
  }
}

throw new DetailedError('操作失败', {
  timestamp: new Date(),
  requestId: 'abc-123',
  userId: 'user-42'
})
```

### 错误类继承

```typescript
// 基础应用错误
class AppError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// 验证错误
class ValidationError extends AppError {
  constructor(
    message: string,
    public field: string
  ) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

// 认证错误
class AuthError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR')
    this.name = 'AuthError'
  }
}

// 使用
try {
  throw new ValidationError('邮箱格式不正确', 'email')
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`字段 ${error.field} 验证失败: ${error.message}`)
  }
}
```

---

## 4. 错误类型守卫

### 自定义类型守卫

```typescript
function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

function isNetworkError(error: unknown): error is Error {
  return error instanceof Error && 'status' in error
}
```

### 使用类型守卫

```typescript
async function fetchData(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new AppError(`HTTP ${response.status}`, 'HTTP_ERROR', response.status)
    }
    return await response.json()
  } catch (error) {
    if (isValidationError(error)) {
      console.error(`验证失败: ${error.field}`)
    } else if (isAppError(error)) {
      console.error(`应用错误 [${error.code}]: ${error.message}`)
    } else if (error instanceof Error) {
      console.error(`未知错误: ${error.message}`)
    } else {
      console.error('非错误值:', error)
    }
    throw error
  }
}
```

---

## 5. Promise 错误处理

### .catch 处理

```typescript
fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  })
  .catch(error => {
    console.error('请求失败:', error)
  })
```

### 静态方法

```typescript
// 立即成功的 Promise
const resolved = Promise.resolve(42)

// 立即失败的 Promise
const rejected = Promise.reject(new Error('失败'))

// 处理
rejected.catch(err => console.error(err.message))
```

### Promise.all 错误处理

```typescript
// 任何一个失败都会进入 catch
try {
  const [user, posts] = await Promise.all([
    fetchUser(1),
    fetchPosts(1)
  ])
} catch (error) {
  // 只要有任何一个失败就执行
  console.error('错误:', error)
}

// 使用 Promise.allSettled 处理部分失败
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
])

results.forEach((result, index) => {
  if (result.status === 'rejected') {
    console.error(`用户 ${index} 失败:`, result.reason)
  }
})
```

---

## 6. async/await 错误处理

### try/catch

```typescript
async function fetchData(): Promise<Data> {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw error
  }
}
```

### 错误处理工具函数

```typescript
// 方式一：返回 [data, error] 元组
async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const result = await fn()
    return [result, null]
  } catch (error) {
    return [null, error as Error]
  }
}

// 使用
const [user, error] = await safeAsync(() => fetchUser(1))
if (error) {
  console.error('Error:', error.message)
} else {
  console.log(user.name)
}

// 方式二：包装函数
function withError<T>(
  fn: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  return fn().catch(() => defaultValue)
}

const user = await withError(
  () => fetchUser(1),
  { id: 0, name: '默认用户' }
)
```

---

## 7. Result 模式

类似 Rust 的 Result 类型，避免使用 try/catch。

### 基本实现

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

function Err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}
```

### 使用示例

```typescript
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err('除数不能为零')
  }
  return Ok(a / b)
}

// 使用
const result = divide(10, 2)
if (result.ok) {
  console.log('结果:', result.value)  // number
} else {
  console.error('错误:', result.error)  // string
}
```

### 异步版本

```typescript
type AsyncResult<T, E = Error> = Promise<Result<T, E>>

async function fetchUserSafe(id: number): AsyncResult<User> {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      return Err(new Error(`HTTP ${response.status}`))
    }
    const user = await response.json()
    return Ok(user)
  } catch (error) {
    return Err(error as Error)
  }
}

// 使用
const result = await fetchUserSafe(1)
if (result.ok) {
  console.log(result.value.name)
} else {
  console.error(result.error.message)
}
```

---

## 8. 错误边界

### React 错误边界

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('错误边界捕获:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>出错了</h1>
    }
    return this.props.children
  }
}

// 使用
<ErrorBoundary fallback={<div>加载失败</div>}>
  <App />
</ErrorBoundary>
```

---

## 9. 实战案例

### 案例 1：类型安全的 API 客户端

```typescript
interface ApiError {
  status: number
  message: string
  code?: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

class ApiClient {
  async request<T>(
    url: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        return {
          success: false,
          error: {
            status: response.status,
            message: response.statusText
          }
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: {
          status: 0,
          message: error instanceof Error ? error.message : '网络错误'
        }
      }
    }
  }
}

// 使用
const client = new ApiClient()
const result = await client.request<User>('/api/user/1')

if (result.success) {
  console.log(result.data?.name)
} else {
  console.error(result.error?.message)
}
```

### 案例 2：表单验证错误

```typescript
interface ValidationError {
  field: string
  message: string
  code: string
}

class FormValidator {
  private errors: ValidationError[] = []

  validate(data: Record<string, any>, rules: Record<string, (value: any) => boolean>) {
    this.errors = []

    for (const [field, rule] of Object.entries(rules)) {
      if (!rule(data[field])) {
        this.errors.push({
          field,
          message: `${field} 验证失败`,
          code: 'VALIDATION_ERROR'
        })
      }
    }

    return this.errors.length === 0
  }

  getErrors(): ValidationError[] {
    return this.errors
  }
}

// 使用
const validator = new FormValidator()
const isValid = validator.validate(
  { name: '', email: 'invalid' },
  {
    name: (v) => v.length > 0,
    email: (v) => v.includes('@')
  }
)

if (!isValid) {
  validator.getErrors().forEach(err => {
    console.error(`${err.field}: ${err.message}`)
  })
}
```

### 案例 3：错误日志系统

```typescript
interface LogEntry {
  timestamp: Date
  level: 'info' | 'warn' | 'error'
  message: string
  error?: Error
  metadata?: Record<string, any>
}

class Logger {
  private logs: LogEntry[] = []

  info(message: string, metadata?: Record<string, any>) {
    this.addLog('info', message, undefined, metadata)
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.addLog('warn', message, undefined, metadata)
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.addLog('error', message, error, metadata)
  }

  private addLog(
    level: LogEntry['level'],
    message: string,
    error?: Error,
    metadata?: Record<string, any>
  ) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      error,
      metadata
    }
    this.logs.push(entry)
    console[level](`[${level}] ${message}`, error || '')
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

// 使用
const logger = new Logger()

try {
  riskyOperation()
} catch (error) {
  logger.error('操作失败', error as Error, { userId: 42 })
}
```

---

## 小结

| 场景 | 推荐方式 |
|------|----------|
| 同步代码 | try/catch |
| 异步代码 | async/await + try/catch |
| 函数返回值 | Result 模式 |
| React 组件 | 错误边界 |
| API 请求 | 类型安全的响应处理 |

**最佳实践**：
- 始终抛出 Error 实例，不要抛出其他值
- 使用自定义错误类携带更多信息
- 使用类型守卫处理 catch 中的 unknown 类型
- 考虑使用 Result 模式替代 try/catch
- 在 React 中使用错误边界
- 记录错误日志，便于排查问题
