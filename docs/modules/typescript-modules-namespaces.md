# TypeScript 模块与命名空间完全指南

> 模块（Modules）和命名空间（Namespaces）是 TypeScript 中组织代码的两种方式。模块是现代 JavaScript 的标准，而命名空间主要用于大型项目和声明合并。

## 目录

1. [模块 vs 命名空间](#1-模块-vs-命名空间)
2. [ES 模块](#2-es-模块)
3. [CommonJS 模块](#3-commonjs-模块)
4. [默认导出与具名导出](#4-默认导出与具名导出)
5. [重新导出（Re-export）](#5-重新导出re-export)
6. [命名空间（Namespace）](#6-命名空间namespace)
7. [命名空间合并](#7-命名空间合并)
8. [环境声明（declare）](#8-环境声明declare)
9. [声明文件（.d.ts）](#9-声明文件dts)
10. [模块解析](#10-模块解析)
11. [实战案例](#11-实战案例)

---

## 1. 模块 vs 命名空间

| 特性 | 模块 | 命名空间 |
|------|------|----------|
| 标准 | ES 标准 | TypeScript 独有 |
| 运行时 | 真正的模块系统 | 编译后合并到全局 |
| 适用场景 | 所有场景 | 大型项目、声明合并 |
| 推荐度 | ✅ 推荐 | ⚠️ 特定场景使用 |

---

## 2. ES 模块

### 导出

```typescript
// math.ts
export const PI = 3.14159

export function add(a: number, b: number): number {
  return a + b
}

export interface Point {
  x: number
  y: number
}
```

### 导入

```typescript
// app.ts
import { PI, add, Point } from './math'

console.log(PI)
console.log(add(1, 2))

const point: Point = { x: 1, y: 2 }
```

### 导入全部

```typescript
import * as Math from './math'

console.log(Math.PI)
console.log(Math.add(1, 2))
```

### 重命名导入

```typescript
import { add as sum } from './math'
console.log(sum(1, 2))
```

---

## 3. CommonJS 模块

```typescript
// math.ts
export const PI = 3.14159

export function add(a: number, b: number): number {
  return a + b
}

// 等同于 CommonJS 写法
// module.exports = { PI, add }
// exports.PI = PI
// exports.add = add
```

```typescript
// app.ts
import { PI, add } from './math'
// 等同于 CommonJS
// const math = require('./math')
```

### 配置

```json
{
  "compilerOptions": {
    "module": "commonjs"  // 或 "es2020", "esnext"
  }
}
```

---

## 4. 默认导出与具名导出

### 默认导出

```typescript
// logger.ts
export default class Logger {
  log(message: string) {
    console.log(message)
  }
}
```

```typescript
// app.ts
import Logger from './logger'

const logger = new Logger()
logger.log('Hello')
```

### 具名导出

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b
}

export function multiply(a: number, b: number): number {
  return a * b
}
```

```typescript
// app.ts
import { add, multiply } from './math'
```

### 混合导出

```typescript
// utils.ts
export default class Utils {
  static format(date: Date): string {
    return date.toISOString()
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

```typescript
// app.ts
import Utils, { sleep } from './utils'
```

---

## 5. 重新导出（Re-export）

### 重新导出所有

```typescript
// index.ts
export * from './math'
export * from './logger'
```

### 重新导出指定

```typescript
// index.ts
export { add, multiply } from './math'
export { default as Logger } from './logger'
```

### 重命名重新导出

```typescript
// index.ts
export { add as sum } from './math'
```

---

## 6. 命名空间（Namespace）

### 基本语法

```typescript
namespace Validation {
  export interface Validator {
    validate(value: string): boolean
  }

  export class EmailValidator implements Validator {
    validate(value: string): boolean {
      return value.includes('@')
    }
  }

  export class PhoneValidator implements Validator {
    validate(value: string): boolean {
      return /^\d{11}$/.test(value)
    }
  }
}

// 使用
const emailValidator = new Validation.EmailValidator()
console.log(emailValidator.validate('test@example.com'))  // true
```

### 嵌套命名空间

```typescript
namespace Shapes {
  export namespace Circles {
    export function area(radius: number): number {
      return Math.PI * radius ** 2
    }
  }

  export namespace Rectangles {
    export function area(width: number, height: number): number {
      return width * height
    }
  }
}

// 使用
console.log(Shapes.Circles.area(10))
console.log(Shapes.Rectangles.area(5, 10))
```

### 别名

```typescript
namespace Shapes {
  export namespace Circles {
    export function area(radius: number): number {
      return Math.PI * radius ** 2
    }
  }
}

// 别名
import CircleUtils = Shapes.Circles
console.log(CircleUtils.area(10))
```

---

## 7. 命名空间合并

### 接口合并

```typescript
interface Window {
  myCustomProperty: string
}

// 合并后 Window 包含 myCustomProperty
```

### 命名空间与类合并

```typescript
class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
}

namespace Greeter {
  export function create(name: string): Greeter {
    return new Greeter(`Hello, ${name}`)
  }
}

// 使用
const greeter = Greeter.create('Alice')
```

### 命名空间与函数合并

```typescript
function buildLabel(name: string): string {
  return `Label: ${name}`
}

namespace buildLabel {
  export let count = 0
}

buildLabel.count++  // 合并后可以访问
```

---

## 8. 环境声明（declare）

### declare var/let/const

```typescript
declare const API_URL: string
declare let cache: Map<string, any>
declare var globalConfig: { debug: boolean }
```

### declare function

```typescript
declare function fetch(url: string): Promise<Response>
declare function setTimeout(callback: () => void, ms: number): number
```

### declare class

```typescript
declare class EventEmitter {
  on(event: string, callback: () => void): void
  emit(event: string): void
}
```

### declare module

```typescript
// 为没有类型的模块添加类型
declare module 'some-module' {
  export function doSomething(): void
  export const version: string
}
```

### declare namespace

```typescript
declare namespace Express {
  interface Request {
    body: any
    query: Record<string, string>
  }

  interface Response {
    json(data: any): void
    status(code: number): Response
  }
}
```

---

## 9. 声明文件（.d.ts）

### 基本声明文件

```typescript
// globals.d.ts
declare const APP_NAME: string
declare function debug(message: string): void
```

### 模块声明文件

```typescript
// types/custom.d.ts
declare module 'custom-module' {
  export function doSomething(): void
  export interface Config {
    debug: boolean
    port: number
  }
}
```

### 扩展已有类型

```typescript
// types/express.d.ts
import { Request, Response } from 'express'

declare module 'express' {
  interface Request {
    user?: {
      id: number
      name: string
    }
  }
}
```

### 配置

```json
{
  "compilerOptions": {
    "typeRoots": ["./@types"],
    "types": ["node", "jest"]
  }
}
```

---

## 10. 模块解析

### 解析策略

```json
{
  "compilerOptions": {
    "moduleResolution": "node"  // 或 "bundler", "classic"
  }
}
```

| 策略 | 说明 |
|------|------|
| `node` | Node.js 解析算法（最常用） |
| `bundler` | 现代打包工具（Vite, Webpack） |
| `classic` | TypeScript 1.6 之前（不推荐） |

### 路径映射

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

```typescript
// 使用路径映射
import { add } from '@/utils/math'
import { Logger } from '@utils/logger'
```

### 相对路径 vs 绝对路径

```typescript
// 相对路径
import { add } from './utils/math'
import { Logger } from '../logger'

// 绝对路径（推荐）
import { add } from '@/utils/math'
```

---

## 11. 实战案例

### 案例 1：工具函数库

```typescript
// utils/math.ts
export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}

export function multiply(a: number, b: number): number {
  return a * b
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('除数不能为零')
  return a / b
}
```

```typescript
// utils/string.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}
```

```typescript
// utils/index.ts
export * from './math'
export * from './string'
```

```typescript
// app.ts
import { add, capitalize } from './utils'

console.log(add(1, 2))
console.log(capitalize('hello'))
```

### 案例 2：类型定义库

```typescript
// types/api.d.ts
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface User {
  id: number
  name: string
  email: string
}

export interface Post {
  id: number
  title: string
  content: string
  authorId: number
}

// 类型守卫
export function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  )
}
```

### 案例 3：全局类型扩展

```typescript
// types/global.d.ts
declare global {
  interface Window {
    __APP_CONFIG__: {
      apiUrl: string
      debug: boolean
    }
  }

  // 扩展 Node.js 全局
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      API_KEY: string
    }
  }
}

export {}  // 使文件成为模块
```

### 案例 4：混合模块与命名空间

```typescript
// validators.ts
export class EmailValidator {
  validate(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}

// 同时使用命名空间扩展
export namespace Validators {
  export class PhoneValidator {
    validate(phone: string): boolean {
      return /^1[3-9]\d{9}$/.test(phone)
    }
  }

  export class IdCardValidator {
    validate(idCard: string): boolean {
      return /^\d{17}[\dX]$/.test(idCard)
    }
  }
}
```

---

## 小结

| 特性 | 语法 | 推荐场景 |
|------|------|----------|
| ES 模块导出 | `export const/function/class` | 所有场景 |
| ES 模块导入 | `import { x } from './module'` | 所有场景 |
| 默认导出 | `export default` | 每个模块一个主要导出 |
| 命名空间 | `namespace X {}` | 声明合并、全局扩展 |
| 环境声明 | `declare const/function/class` | 为 JS 代码添加类型 |
| 声明文件 | `.d.ts` | 类型定义、第三方类型 |
| 路径映射 | `paths: { "@/*": [...] }` | 简化导入路径 |

**最佳实践**：
- 优先使用 ES 模块
- 使用 `export * from` 统一导出入口
- 命名空间仅用于声明合并和全局扩展
- 使用 `.d.ts` 为 JS 代码添加类型
- 使用路径映射简化导入
- 避免循环依赖
