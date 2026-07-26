# TypeScript 装饰器新旧版本对比指南

> TypeScript 装饰器有两个版本：Legacy（实验性，Stage 2）和 Standard（标准，Stage 3）。Standard 装饰器从 TypeScript 5.0 开始支持，是未来推荐的使用方式。

## 目录

1. [新旧版本概览](#1-新旧版本概览)
2. [配置差异](#2-配置差异)
3. [类装饰器对比](#3-类装饰器对比)
4. [方法装饰器对比](#4-方法装饰器对比)
5. [访问器装饰器对比](#5-访问器装饰器对比)
6. [属性装饰器对比](#6-属性装饰器对比)
7. [参数装饰器对比](#7-参数装饰器对比)
8. [装饰器工厂对比](#8-装饰器工厂对比)
9. [上下文对象（Context）](#9-上下文对象context)
10. [元数据支持](#10-元数据支持)
11. [迁移指南](#11-迁移指南)

---

## 1. 新旧版本概览

| 特性 | Legacy（Stage 2） | Standard（Stage 3） |
|------|-------------------|---------------------|
| TypeScript 版本 | < 5.0 | >= 5.0 |
| 配置选项 | `experimentalDecorators` | 无需特殊配置 |
| 参数签名 | 每种装饰器不同 | 统一 `context` 参数 |
| 元数据支持 | 需要 `reflect-metadata` | 内置 `context.metadata` |
| PropertyDescriptor | 直接访问 | 通过 `context.addInitializer` |
| ECMAScript 标准 | 实验性 | Stage 3，即将成为标准 |
| 推荐度 | ⚠️ 旧项目使用 | ✅ 新项目推荐 |

---

## 2. 配置差异

### Legacy 装饰器

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Standard 装饰器

```json
{
  "compilerOptions": {
    // 无需特殊配置（TypeScript 5.0+）
  }
}
```

---

## 3. 类装饰器对比

### Legacy 语法

```typescript
// Legacy: 接收 constructor 作为参数
function Sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@Sealed
class Greeter {
  constructor(public greeting: string) {}
  greet() { return `Hello, ${this.greeting}` }
}
```

### Standard 语法

```typescript
// Standard: 接收 context 对象，返回修改函数
function Sealed(context: ClassDecoratorContext) {
  return function (constructor: Function) {
    Object.seal(constructor)
    Object.seal(constructor.prototype)
  }
}

@Sealed
class Greeter {
  constructor(public greeting: string) {}
  greet() { return `Hello, ${this.greeting}` }
}
```

---

## 4. 方法装饰器对比

### Legacy 语法

```typescript
// Legacy: 三个独立参数
function Log(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log(`调用 ${propertyKey}`)
    console.log(`参数: ${JSON.stringify(args)}`)
    const result = originalMethod.apply(this, args)
    console.log(`结果: ${JSON.stringify(result)}`)
    return result
  }

  return descriptor
}

class Calculator {
  @Log
  add(x: number, y: number): number {
    return x + y
  }
}
```

### Standard 语法

```typescript
// Standard: target + context，返回新函数
function Log(
  target: Function,
  context: ClassMethodDecoratorContext
) {
  const methodName = String(context.name)

  return function (this: any, ...args: any[]) {
    console.log(`调用 ${methodName}`)
    console.log(`参数: ${JSON.stringify(args)}`)
    const result = Reflect.apply(target, this, args)
    console.log(`结果: ${JSON.stringify(result)}`)
    return result
  }
}

class Calculator {
  @Log
  add(x: number, y: number): number {
    return x + y
  }
}
```

---

## 5. 访问器装饰器对比

### Legacy 语法

```typescript
function ReadOnly(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  descriptor.writable = false
  return descriptor
}

class Circle {
  private _radius: number
  constructor(radius: number) { this._radius = radius }

  @ReadOnly
  get radius() { return this._radius }
}
```

### Standard 语法

```typescript
// Standard: 使用 accessor 关键字
function ReadOnly(
  target: Function,
  context: ClassAccessorDecoratorContext
) {
  return {
    get() { return this._radius },
    set(value: number) { /* 忽略 */ }
  }
}

class Circle {
  accessor _radius: number

  constructor(radius: number) { this._radius = radius }

  get radius() { return this._radius }
}
```

---

## 6. 属性装饰器对比

### Legacy 语法

```typescript
import 'reflect-metadata'

const formatMetadataKey = Symbol('format')

function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString)
}

class Greeter {
  @format('Hello, %s')
  greeting: string = 'World'

  greet() {
    const fmt = Reflect.getMetadata(formatMetadataKey, this, 'greeting')
    return fmt?.replace('%s', this.greeting)
  }
}
```

### Standard 语法

```typescript
function format(formatString: string) {
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    context.metadata.format = formatString

    return function (initialValue: string) {
      console.log(`初始化 ${String(context.name)}: ${initialValue}`)
      return initialValue
    }
  }
}

class Greeter {
  @format('Hello, %s')
  greeting: string = 'World'

  greet() {
    const fmt = (this.constructor as any).metadata?.format
    return fmt?.replace('%s', this.greeting)
  }
}
```

---

## 7. 参数装饰器对比

### Legacy 语法

```typescript
import 'reflect-metadata'

const requiredKey = Symbol('required')

function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  const existing = Reflect.getOwnMetadata(requiredKey, target, propertyKey) || []
  existing.push(parameterIndex)
  Reflect.defineMetadata(requiredKey, existing, target, propertyKey)
}

class UserService {
  createUser(@required name: string, @required email: string) {
    return { name, email }
  }
}
```

### Standard 语法

```typescript
function required(
  value: undefined,
  context: ClassMethodDecoratorContext,
  index: number
) {
  const existing = (context.metadata.requiredIndices as number[]) || []
  existing.push(index)
  context.metadata.requiredIndices = existing
}

class UserService {
  createUser(@required name: string, @required email: string) {
    return { name, email }
  }
}
```

---

## 8. 装饰器工厂对比

### Legacy 语法

```typescript
function Log(method: string) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      console.log(`[${method}] ${propertyKey}`)
      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}

class UserService {
  @Log('GET')
  getUser(id: number) { /* ... */ }
}
```

### Standard 语法

```typescript
function Log(method: string) {
  return function (
    target: Function,
    context: ClassMethodDecoratorContext
  ) {
    const methodName = String(context.name)

    return function (this: any, ...args: any[]) {
      console.log(`[${method}] ${methodName}`)
      return Reflect.apply(target, this, args)
    }
  }
}

class UserService {
  @Log('GET')
  getUser(id: number) { /* ... */ }
}
```

---

## 9. 上下文对象（Context）

Standard 装饰器使用统一的 `context` 对象：

```typescript
interface ClassDecoratorContext {
  kind: 'class'
  name: string | undefined
  metadata: object
  addInitializer(initializer: () => void): void
}

interface ClassMethodDecoratorContext {
  kind: 'method'
  name: string | symbol
  static: boolean
  private: boolean
  access: { get(): unknown; set(value: unknown): void }
  metadata: object
  addInitializer(initializer: () => void): void
}

interface ClassFieldDecoratorContext {
  kind: 'field'
  name: string | symbol
  static: boolean
  private: boolean
  metadata: object
  addInitializer(initializer: () => void): void
}

interface ClassAccessorDecoratorContext {
  kind: 'accessor'
  name: string | symbol
  static: boolean
  private: boolean
  access: { get(): unknown; set(value: unknown): void }
  metadata: object
  addInitializer(initializer: () => void): void
}
```

---

## 10. 元数据支持

### Legacy 方式

```typescript
import 'reflect-metadata'

// 定义元数据
Reflect.metadata('key', 'value')

// 读取元数据
const value = Reflect.getMetadata('key', target, propertyKey)
```

### Standard 方式

```typescript
// 通过 context.metadata 直接访问
function MyDecorator(value: string) {
  return function (target: Function, context: ClassDecoratorContext) {
    context.metadata.customKey = value
  }
}

// 读取元数据
const value = (Target as any).metadata?.customKey
```

---

## 11. 迁移指南

### 迁移步骤

1. **更新 TypeScript** 到 5.0+
2. **移除配置**：删除 `experimentalDecorators` 和 `emitDecoratorMetadata`
3. **重写装饰器函数**：使用 `context` 参数
4. **替换元数据**：使用 `context.metadata` 替代 `reflect-metadata`
5. **更新类定义**：使用 `accessor` 关键字（如果需要）

### 迁移示例

```typescript
// Legacy
function Log(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log(`调用 ${propertyKey}`)
    return original.apply(this, args)
  }
  return descriptor
}

// Standard
function Log(target: Function, context: ClassMethodDecoratorContext) {
  const name = String(context.name)
  return function (this: any, ...args: any[]) {
    console.log(`调用 ${name}`)
    return Reflect.apply(target, this, args)
  }
}
```

### 注意事项

- Legacy 装饰器将在 TypeScript 6.0 中被废弃
- Standard 装饰器是 ECMAScript Stage 3 提案
- 两者不能在同一项目中混用
- 部分框架（如 Angular、NestJS）可能仍使用 Legacy 装饰器

---

## 小结

| 场景 | 推荐 |
|------|------|
| 新项目 | Standard（Stage 3） |
| 维护旧项目 | Legacy（Stage 2） |
| 使用 Angular | Legacy（Angular 还在迁移） |
| 使用 NestJS | Legacy（NestJS 还在迁移） |
| 面向未来 | Standard（Stage 3） |

**最佳实践**：
- 新项目始终使用 Standard 装饰器
- 使用 `context.metadata` 替代 `reflect-metadata`
- 使用 `accessor` 关键字实现访问器装饰器
- 使用 `Reflect.apply` 调用原始方法
- 关注框架迁移进度
