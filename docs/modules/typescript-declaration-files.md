# TypeScript 声明文件（.d.ts）完全指南

> 声明文件（Declaration Files）是 TypeScript 中用于描述 JavaScript 库类型的文件。它们让你可以在 TypeScript 中安全地使用没有类型的第三方库。

## 目录

1. [什么是声明文件](#1-什么是声明文件)
2. [基本语法](#2-基本语法)
3. [模块声明](#3-模块声明)
4. [命名空间声明](#4-命名空间声明)
5. [全局声明](#5-全局声明)
6. [类型声明文件](#6-类型声明文件)
7. [声明文件组织](#7-声明文件组织)
8. [实战案例](#8-实战案例)

---

## 1. 什么是声明文件

声明文件（.d.ts）只包含类型声明，不包含实现代码。

```typescript
// math.js - JavaScript 文件
export function add(a, b) {
  return a + b
}

// math.d.ts - 声明文件
export function add(a: number, b: number): number
```

---

## 2. 基本语法

### 函数声明

```typescript
// 声明函数
export function add(a: number, b: number): number
export function multiply(a: number, b: number): number
```

### 类声明

```typescript
export class Animal {
  name: string
  constructor(name: string)
  speak(): string
}
```

### 接口声明

```typescript
export interface User {
  id: number
  name: string
  email: string
}
```

### 类型别名声明

```typescript
export type ID = string | number
export type Callback = () => void
```

---

## 3. 模块声明

### 为 JS 库添加类型

```typescript
// types/my-lib.d.ts
declare module 'my-lib' {
  export function doSomething(): void
  export const version: string
  export interface Config {
    debug: boolean
    port: number
  }
}
```

### 模块声明合并

```typescript
// 扩展已有模块
declare module 'express' {
  interface Request {
    user?: {
      id: number
      name: string
    }
  }
}
```

---

## 4. 命名空间声明

### 全局命名空间

```typescript
// types/globals.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    API_KEY: string
  }
}
```

### 模块内命名空间

```typescript
declare module 'my-lib' {
  export namespace Utils {
    export function format(date: Date): string
    export function parse(str: string): Date
  }
}
```

---

## 5. 全局声明

### 全局变量

```typescript
// types/globals.d.ts
declare const APP_NAME: string
declare const API_URL: string
declare function debug(message: string): void
```

### 全局类型扩展

```typescript
// 扩展 Window
declare global {
  interface Window {
    __APP_CONFIG__: {
      apiUrl: string
      debug: boolean
    }
  }
}

export {}  // 使文件成为模块
```

---

## 6. 类型声明文件

### 查找类型

```bash
# 安装 @types 包
npm install @types/node --save-dev
npm install @types/express --save-dev
npm install @types/jest --save-dev
```

### 配置类型

```json
{
  "compilerOptions": {
    "typeRoots": ["./@types"],
    "types": ["node", "jest"]
  }
}
```

### 自定义类型目录

```
project/
├── @types/
│   ├── my-lib/
│   │   └── index.d.ts
│   └── custom/
│       └── types.d.ts
├── src/
└── tsconfig.json
```

---

## 7. 声明文件组织

### 项目结构

```
project/
├── src/
│   ├── index.ts
│   └── utils.ts
├── types/
│   ├── globals.d.ts      # 全局类型
│   ├── my-lib.d.ts       # 第三方库类型
│   └── custom/
│       └── types.d.ts    # 自定义类型
├── @types/               # @types 包
│   └── node/
└── tsconfig.json
```

### tsconfig 配置

```json
{
  "compilerOptions": {
    "typeRoots": ["./@types", "./types"],
    "types": ["node"]
  }
}
```

---

## 8. 实战案例

### 案例 1：为 Express 添加自定义属性

```typescript
// types/express.d.ts
import { Request, Response } from 'express'

declare module 'express' {
  interface Request {
    user?: {
      id: number
      name: string
      role: string
    }
  }

  interface Response {
    success(data: any): void
    error(code: number, message: string): void
  }
}
```

### 案例 2：环境变量类型

```typescript
// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      DATABASE_URL: string
      REDIS_URL: string
      JWT_SECRET: string
    }
  }
}

export {}
```

### 案例 3：全局工具函数

```typescript
// types/utils.d.ts
declare function formatDate(date: Date, format: string): string
declare function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T

// 使用
formatDate(new Date(), 'YYYY-MM-DD')
debounce(() => console.log('hello'), 300)
```

---

## 小结

| 文件类型 | 用途 | 示例 |
|----------|------|------|
| `.d.ts` | 类型声明 | `math.d.ts` |
| `@types/*` | 第三方类型 | `@types/node` |
| `types/` | 自定义类型 | `types/globals.d.ts` |
| `declare module` | 模块声明 | 为 JS 库添加类型 |
| `declare global` | 全局扩展 | 扩展 Window |

**最佳实践**：
- 使用 `@types` 安装第三方类型
- 将自定义类型放在 `types/` 目录
- 使用 `declare module` 为 JS 库添加类型
- 使用 `declare global` 扩展全局类型
- 在 `tsconfig.json` 中配置 `typeRoots`
