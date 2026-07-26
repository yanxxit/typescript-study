# TypeScript async/await 与 Promise 完全指南

> async/await 和 Promise 是 TypeScript 中处理异步操作的核心。掌握它们，你就能优雅地处理网络请求、文件操作、定时器等异步任务。

## 目录

1. [什么是 Promise](#1-什么是-promise)
2. [Promise 基础](#2-promise-基础)
3. [Promise 链式调用](#3-promise-链式调用)
4. [Promise 错误处理](#4-promise-错误处理)
5. [async/await 基础](#5-asyncawait-基础)
6. [async/await 错误处理](#6-asyncawait-错误处理)
7. [Promise 静态方法](#7-promise-静态方法)
8. [Promise 工具类型](#8-promise-工具类型)
9. [高级模式](#9-高级模式)
10. [实战案例](#10-实战案例)

---

## 1. 什么是 Promise

Promise 是一个表示异步操作最终完成或失败的对象。

```typescript
// Promise 的三种状态
// 1. pending（进行中）
// 2. fulfilled（已成功）
// 3. rejected（已失败）

const promise = new Promise<string>((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    resolve('成功')  // 变为 fulfilled
    // reject('失败')  // 变为 rejected
  }, 1000)
})
```

---

## 2. Promise 基础

### 创建 Promise

```typescript
const promise = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000)
})
```

### 使用 Promise

```typescript
promise
  .then(value => {
    console.log(value)  // '成功'
  })
  .catch(error => {
    console.error(error)
  })
  .finally(() => {
    console.log('完成')
  })
```

### TypeScript 类型

```typescript
// Promise 类型
const promise: Promise<string> = new Promise(resolve => {
  resolve('hello')
})

// Promise 泛型
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json())
}
```

---

## 3. Promise 链式调用

```typescript
// 链式调用
fetch('/api/user/1')
  .then(response => response.json())
  .then(user => {
    console.log(user.name)
    return fetch(`/api/posts?userId=${user.id}`)
  })
  .then(response => response.json())
  .then(posts => {
    console.log(posts)
  })
  .catch(error => {
    console.error('Error:', error)
  })
```

### 泛型链式调用

```typescript
interface User {
  id: number
  name: string
}

interface Post {
  id: number
  title: string
  userId: number
}

function fetchUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json())
}

function fetchPosts(userId: number): Promise<Post[]> {
  return fetch(`/api/posts?userId=${userId}`).then(res => res.json())
}

// 类型安全的链式调用
fetchUser(1)
  .then(user => {
    console.log(user.name)  // string
    return fetchPosts(user.id)
  })
  .then(posts => {
    console.log(posts)  // Post[]
  })
```

---

## 4. Promise 错误处理

### catch 捕获错误

```typescript
promise
  .then(value => {
    // 可能抛出错误
    throw new Error('出错了')
  })
  .catch(error => {
    console.error(error.message)  // '出错了'
  })
```

### finally 执行清理

```typescript
promise
  .then(value => console.log(value))
  .catch(error => console.error(error))
  .finally(() => {
    // 无论成功失败都执行
    console.log('清理资源')
  })
```

### 静态方法创建 rejected Promise

```typescript
// 立即成功
const resolved = Promise.resolve('成功')

// 立即失败
const rejected = Promise.reject(new Error('失败'))

// 处理错误
rejected.catch(err => console.error(err.message))
```

---

## 5. async/await 基础

async/await 是 Promise 的语法糖，让异步代码看起来像同步代码。

### 基本用法

```typescript
// async 函数总是返回 Promise
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const user: User = await response.json()
  return user
}

// 使用
const user = await fetchUser(1)
console.log(user.name)
```

### async 函数的返回值

```typescript
// async 函数总是返回 Promise
async function getData(): Promise<string> {
  return 'hello'  // 自动包装为 Promise<string>
}

// 等同于
function getData(): Promise<string> {
  return Promise.resolve('hello')
}
```

### await 的作用

```typescript
// await 暂停执行，等待 Promise 完成
async function process() {
  console.log('开始')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('1 秒后')
}
```

---

## 6. async/await 错误处理

### try/catch 捕获错误

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
    throw error  // 重新抛出
  }
}
```

### 错误处理工具函数

```typescript
// 包装 async 函数，统一错误处理
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
```

### 多个异步操作错误处理

```typescript
async function processData() {
  try {
    const [user, posts] = await Promise.all([
      fetchUser(1),
      fetchPosts(1)
    ])
    console.log(user, posts)
  } catch (error) {
    // 任何一个失败都会进入这里
    console.error('Error:', error)
  }
}
```

---

## 7. Promise 静态方法

### Promise.all

所有 Promise 都成功才成功，任一失败则失败。

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(1),
  fetchPosts(1),
  fetchComments(1)
])
```

### Promise.allSettled

等待所有 Promise 完成，无论成功或失败。

```typescript
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
])

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`用户 ${index}:`, result.value)
  } else {
    console.log(`用户 ${index} 失败:`, result.reason)
  }
})
```

### Promise.race

第一个完成（无论成功或失败）的结果。

```typescript
// 超时控制
function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('超时')), ms)
  })
}

async function fetchWithTimeout(url: string, ms: number) {
  return Promise.race([
    fetch(url),
    timeout(ms)
  ])
}
```

### Promise.any

第一个成功的结果，全部失败则失败。

```typescript
async function fetchFromMultiple(urls: string[]) {
  return Promise.any(
    urls.map(url => fetch(url).then(res => res.json()))
  )
}
```

### Promise.resolve / Promise.reject

```typescript
// 快速创建已解决的 Promise
const resolved = Promise.resolve(42)

// 快速创建已拒绝的 Promise
const rejected = Promise.reject(new Error('失败'))
```

---

## 8. Promise 工具类型

### TypeScript 内置

```typescript
// 提取 Promise 内部类型
type A = Awaited<Promise<string>>           // string
type B = Awaited<Promise<Promise<number>>>  // number

// 提取异步函数返回类型
async function getData(): Promise<{ id: number }> {
  return { id: 1 }
}

type DataType = Awaited<ReturnType<typeof getData>>
// { id: number }
```

### 自定义工具类型

```typescript
// 解包 Promise
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T

// 深度解包
type DeepUnwrap<T> = T extends Promise<infer R> ? DeepUnwrap<R> : T

// 检查是否为 Promise
type IsPromise<T> = T extends Promise<any> ? true : false

// 将函数返回值变为 Promise
type Promisify<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : never
```

---

## 9. 高级模式

### 并发控制

```typescript
// 限制并发数量
async function parallel<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = []
  const executing: Promise<void>[] = []

  for (const task of tasks) {
    const p = task().then(result => {
      results.push(result)
    })
    executing.push(p)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
      executing.splice(executing.findIndex(e => e === p), 1)
    }
  }

  await Promise.all(executing)
  return results
}
```

### 重试机制

```typescript
async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      console.log(`尝试 ${attempt} 失败: ${error}`)

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }

  throw lastError!
}
```

### 缓存 Promise

```typescript
function memoizeAsync<T>(
  fn: (...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T> {
  const cache = new Map<string, Promise<T>>()

  return (...args: any[]) => {
    const key = JSON.stringify(args)
    if (!cache.has(key)) {
      cache.set(key, fn(...args))
    }
    return cache.get(key)!
  }
}
```

---

## 10. 实战案例

### 案例 1：API 请求封装

```typescript
interface ApiOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
}

async function api<T>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// 使用
interface User {
  id: number
  name: string
}

const user = await api<User>('/api/user/1')
const newUser = await api<User>('/api/users', {
  method: 'POST',
  body: { name: 'Alice' }
})
```

### 案例 2：并行请求

```typescript
interface UserData {
  user: User
  posts: Post[]
  comments: Comment[]
}

async function loadDashboard(userId: number): Promise<UserData> {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
    fetchComments(userId)
  ])

  return { user, posts, comments }
}

// 带错误处理
async function safeLoadDashboard(userId: number) {
  try {
    return await loadDashboard(userId)
  } catch (error) {
    console.error('加载失败:', error)
    return null
  }
}
```

### 案例 3：请求超时

```typescript
async function fetchWithTimeout<T>(
  url: string,
  timeoutMs: number = 5000
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      signal: controller.signal
    })
    return await response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

// 使用
try {
  const data = await fetchWithTimeout<{ id: number }>('/api/data')
} catch (error) {
  if (error instanceof DOMException && error.name === 'AbortError') {
    console.error('请求超时')
  }
}
```

### 案例 4：请求取消

```typescript
function createCancelableFetch<T>(url: string) {
  const controller = new AbortController()

  const promise = fetch(url, {
    signal: controller.signal
  }).then(res => res.json()) as Promise<T>

  return {
    promise,
    cancel: () => controller.abort()
  }
}

// 使用
const { promise, cancel } = createCancelableFetch<User>('/api/user/1')

// 3 秒后取消
setTimeout(cancel, 3000)

try {
  const user = await promise
  console.log(user)
} catch (error) {
  if (error instanceof DOMException) {
    console.log('请求已取消')
  }
}
```

---

## 小结

| 特性 | 语法 | 说明 |
|------|------|------|
| 创建 Promise | `new Promise((resolve, reject) => {})` | 创建 Promise |
| then | `.then(value => {})` | 成功回调 |
| catch | `.catch(error => {})` | 失败回调 |
| finally | `.finally(() => {})` | 完成回调 |
| async 函数 | `async function f() {}` | 返回 Promise |
| await | `await promise` | 等待 Promise 完成 |
| Promise.all | `Promise.all([...])` | 全部成功才成功 |
| Promise.race | `Promise.race([...])` | 第一个完成的结果 |
| Promise.allSettled | `Promise.allSettled([...])` | 等待全部完成 |
| Promise.any | `Promise.any([...])` | 第一个成功的结果 |

**最佳实践**：
- 优先使用 async/await 而不是 .then 链
- 始终使用 try/catch 处理错误
- 使用 Promise.all 并行执行独立操作
- 使用 AbortController 实现超时和取消
- 使用 Promise.allSettled 处理可能失败的操作
- 避免在循环中使用 await（除非需要顺序执行）
