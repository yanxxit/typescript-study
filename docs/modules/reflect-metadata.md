# reflect-metadata 完全指南

> reflect-metadata 是一个用于在声明装饰器时执行元数据类型注解和元数据反射的 API。它是 TypeScript 装饰器生态的基石，被 NestJS、TypeORM、Angular 等主流框架广泛使用。

## 目录

1. [为什么需要 reflect-metadata](#1-为什么需要-reflect-metadata)
2. [安装与配置](#2-安装与配置)
3. [核心概念](#3-核心概念)
4. [Reflect API 详解](#4-reflect-api-详解)
5. [预定义元数据键](#5-预定义元数据键)
6. [实战案例](#6-实战案例)
7. [与装饰器配合使用](#7-与装饰器配合使用)
8. [常见框架中的应用](#8-常见框架中的应用)
9. [最佳实践](#9-最佳实践)

---

## 1. 为什么需要 reflect-metadata

### 问题：装饰器无法访问类型信息

JavaScript 的装饰器在运行时只能拿到值，**无法拿到类型信息**。但 TypeScript 有丰富的类型系统，我们希望在运行时也能利用这些类型。

```typescript
// 没有 reflect-metadata 时，装饰器不知道属性的类型
function validate(target: any, key: string) {
  // 这里不知道 target[key] 应该是什么类型
  // 无法进行类型检查
}

class User {
  @validate
  name: string  // 装饰器不知道 name 是 string 类型
}
```

### 解决方案：元数据反射

reflect-metadata 允许 TypeScript 在编译时将类型信息存储为元数据，装饰器可以在运行时读取这些元数据。

```typescript
// 使用 reflect-metadata 后，装饰器可以获取类型信息
function validate(target: any, key: string) {
  const type = Reflect.getMetadata('design:type', target, key)
  console.log(`${key} 的类型是: ${type.name}`)  // "name 的类型是: String"
}

class User {
  @validate
  name: string  // 装饰器知道 name 是 string 类型
}
```

---

## 2. 安装与配置

### 安装

```bash
npm install reflect-metadata --save
```

### 全局导入

在应用入口文件中导入（必须在其他代码之前）：

```typescript
import 'reflect-metadata'
```

### tsconfig.json 配置

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

| 选项 | 作用 |
|------|------|
| `experimentalDecorators` | 启用装饰器语法支持 |
| `emitDecoratorMetadata` | 在编译时自动生成元数据代码 |

---

## 3. 核心概念

### 什么是元数据

元数据是附加在对象上的额外信息，以 **键值对** 形式存储。

```
对象 → 元数据存储空间 → { key: value, key2: value2 }
```

### 元数据的作用域

元数据可以附加在三个层级：

| 层级 | 说明 | 示例 |
|------|------|------|
| 类 | 整个类的元数据 | 路由前缀、数据库表名 |
| 方法 | 单个方法的元数据 | 路由路径、权限要求 |
| 参数 | 方法参数的元数据 | 参数验证规则、来源 |

### 元数据的存储

元数据存储在对象的 `[[Metadata]]` 内部槽中，通过 `Reflect` API 访问。

```
User.prototype
  ├── name: string
  ├── age: number
  └── [[Metadata]]
        ├── design:type → String
        ├── design:paramtypes → [String, Number]
        └── design:returntype → Boolean
```

---

## 4. Reflect API 详解

### Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey?)

定义元数据。

```typescript
// 类级元数据
Reflect.defineMetadata('route', '/api/users', User)

// 方法级元数据
Reflect.defineMetadata('route', '/api/users/:id', User.prototype, 'getUser')

// 参数级元数据
Reflect.defineMetadata('validate', { required: true }, User.prototype, 'createUser', 0)
```

### Reflect.getMetadata(metadataKey, target, propertyKey?)

获取元数据（会沿原型链向上查找）。

```typescript
// 获取类的元数据
const route = Reflect.getMetadata('route', User)  // '/api/users'

// 获取方法的元数据
const methodRoute = Reflect.getMetadata('route', User.prototype, 'getUser')
// '/api/users/:id'
```

### Reflect.getOwnMetadata(metadataKey, target, propertyKey?)

获取自身的元数据（不沿原型链查找）。

```typescript
// 只获取自身定义的元数据，不查找父类
const ownRoute = Reflect.getOwnMetadata('route', ChildUser)
```

### Reflect.hasMetadata(metadataKey, target, propertyKey?)

检查是否存在元数据（会沿原型链向上查找）。

```typescript
const hasRoute = Reflect.hasMetadata('route', User)  // true
```

### Reflect.hasOwnMetadata(metadataKey, target, propertyKey?)

检查自身是否存在元数据（不沿原型链查找）。

```typescript
const hasOwnRoute = Reflect.hasOwnMetadata('route', ChildUser)
```

### Reflect.deleteMetadata(metadataKey, target, propertyKey?)

删除元数据。

```typescript
Reflect.deleteMetadata('route', User)
```

### Reflect.metadata(metadataKey, metadataValue)

创建一个装饰器工厂，用于定义元数据。

```typescript
const Route = (path: string) => Reflect.metadata('route', path)

// 使用装饰器工厂
@Route('/api/users')
class UserController {
  @Route('/:id')
  getUser() {}
}
```

---

## 5. 预定义元数据键

TypeScript 编译器在开启 `emitDecoratorMetadata` 后，会自动生成以下三个预定义元数据：

### design:type

存储属性的类型构造函数。

```typescript
class User {
  name: string     // → Reflect.getMetadata('design:type', User.prototype, 'name') → String
  age: number      // → Reflect.getMetadata('design:type', User.prototype, 'age') → Number
  active: boolean  // → Reflect.getMetadata('design:type', User.prototype, 'active') → Boolean
}
```

### design:paramtypes

存储构造函数或方法的参数类型数组。

```typescript
class User {
  constructor(
    name: string,   // → [String]
    age: number     // → [String, Number]
  ) {}

  greet(message: string): string {  // → [String]
    return `${message}, ${this.name}`
  }
}

// 获取构造函数参数类型
const paramTypes = Reflect.getMetadata('design:paramtypes', User)
// [String, Number]

// 获取方法参数类型
const methodParamTypes = Reflect.getMetadata('design:paramtypes', User.prototype, 'greet')
// [String]
```

### design:returntype

存储方法的返回类型。

```typescript
class User {
  greet(): string {           // → String
    return 'hello'
  }

  getAge(): number {          // → Number
    return 30
  }

  isActive(): boolean {       // → Boolean
    return true
  }
}

const returnType = Reflect.getMetadata('design:returntype', User.prototype, 'greet')
// String
```

---

## 6. 实战案例

### 案例 1：自动类型验证

```typescript
import 'reflect-metadata'

function validate(target: any, propertyKey: string) {
  const type = Reflect.getMetadata('design:type', target, propertyKey)

  Object.defineProperty(target, propertyKey, {
    set(value: any) {
      if (!(value instanceof type)) {
        throw new TypeError(`${propertyKey} 期望类型 ${type.name}，实际传入 ${value.constructor.name}`)
      }
      this[`_${propertyKey}`] = value
    },
    get() {
      return this[`_${propertyKey}`]
    }
  })
}

class User {
  @validate
  name: string

  @validate
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

const user = new User('Alice', 30)  // ✅ 正确
// const user2 = new User('Alice', '30')  // ❌ TypeError: age 期望类型 Number
```

### 案例 2：路由系统

```typescript
import 'reflect-metadata'

const ROUTE_KEY = Symbol('route')

const Get = (path: string) => (target: any, propertyKey: string) => {
  Reflect.defineMetadata(ROUTE_KEY, { method: 'GET', path }, target, propertyKey)
}

const Post = (path: string) => (target: any, propertyKey: string) => {
  Reflect.defineMetadata(ROUTE_KEY, { method: 'POST', path }, target, propertyKey)
}

class UserController {
  @Get('/users')
  listUsers() {
    return '获取用户列表'
  }

  @Get('/users/:id')
  getUser() {
    return '获取单个用户'
  }

  @Post('/users')
  createUser() {
    return '创建用户'
  }
}

// 收集所有路由
const controller = new UserController()
const routes = Object.getOwnPropertyNames(UserController.prototype)
  .filter(method => method !== 'constructor')
  .map(method => ({
    method,
    ...Reflect.getMetadata(ROUTE_KEY, controller, method)
  }))

console.log(routes)
// [
//   { method: 'listUsers', method: 'GET', path: '/users' },
//   { method: 'getUser', method: 'GET', path: '/users/:id' },
//   { method: 'createUser', method: 'POST', path: '/users' }
// ]
```

### 案例 3：权限控制

```typescript
import 'reflect-metadata'

const PERMISSION_KEY = Symbol('permission')

const RequirePermission = (permission: string) =>
  (target: any, propertyKey: string) => {
    Reflect.defineMetadata(PERMISSION_KEY, permission, target, propertyKey)
  }

function checkPermission(instance: any, methodName: string) {
  const requiredPermission = Reflect.getMetadata(PERMISSION_KEY, instance, methodName)
  if (requiredPermission) {
    const userPermissions = ['read', 'write']  // 模拟用户权限
    if (!userPermissions.includes(requiredPermission)) {
      throw new Error(`需要权限: ${requiredPermission}`)
    }
  }
}

class Document {
  @RequirePermission('read')
  view() {
    return '查看文档'
  }

  @RequirePermission('write')
  edit() {
    return '编辑文档'
  }

  @RequirePermission('admin')
  delete() {
    return '删除文档'
  }
}

const doc = new Document()
console.log(doc.view())   // ✅ '查看文档'
console.log(doc.edit())   // ✅ '编辑文档'
// doc.delete()  // ❌ Error: 需要权限: admin
```

### 案例 4：依赖注入容器

```typescript
import 'reflect-metadata'

const INJECT_KEY = Symbol('inject')
const SERVICE_KEY = Symbol('service')

// 服务装饰器
const Service = () => (target: any) => {
  Reflect.defineMetadata(SERVICE_KEY, true, target)
}

// 注入装饰器
const Inject = (token: any) => (target: any, propertyKey: string, parameterIndex: number) => {
  const existingTokens = Reflect.getMetadata(INJECT_KEY, target, propertyKey) || {}
  existingTokens[parameterIndex] = token
  Reflect.defineMetadata(INJECT_KEY, existingTokens, target, propertyKey)
}

// 简单的 IoC 容器
class Container {
  private services = new Map<any, any>()

  register(token: any, implementation: any) {
    this.services.set(token, implementation)
  }

  resolve<T>(token: any): T {
    const Implementation = this.services.get(token)
    if (!Implementation) {
      throw new Error(`服务 ${token.name} 未注册`)
    }

    // 获取构造函数参数的注入信息
    const injectTokens = Reflect.getMetadata(INJECT_KEY, Implementation) || {}
    const constructorParams = Reflect.getMetadata('design:paramtypes', Implementation) || []

    // 递归解析依赖
    const args = constructorParams.map((_: any, index: number) => {
      const token = injectTokens[index] || constructorParams[index]
      return this.resolve(token)
    })

    return new Implementation(...args)
  }
}

// 使用示例
@Service()
class Database {
  query(sql: string) {
    return `执行查询: ${sql}`
  }
}

@Service()
class UserRepository {
  constructor(
    @Inject(Database) private db: Database
  ) {}

  findAll() {
    return this.db.query('SELECT * FROM users')
  }
}

const container = new Container()
container.register(Database, Database)
container.register(UserRepository, UserRepository)

const userRepo = container.resolve(UserRepository)
console.log(userRepo.findAll())  // "执行查询: SELECT * FROM users"
```

---

## 7. 与装饰器配合使用

### 类装饰器 + 元数据

```typescript
import 'reflect-metadata'

const Controller = (prefix: string) => (target: any) => {
  Reflect.defineMetadata('prefix', prefix, target)
}

@Controller('/api/v1')
class UserController {
  getPrefix(): string {
    return Reflect.getMetadata('prefix', this.constructor)
  }
}

const controller = new UserController()
console.log(controller.getPrefix())  // '/api/v1'
```

### 方法装饰器 + 元数据

```typescript
import 'reflect-metadata'

const Cacheable = (ttl: number) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  Reflect.defineMetadata('cacheable', true, target, propertyKey)
  Reflect.defineMetadata('cacheTtl', ttl, target, propertyKey)

  const originalMethod = descriptor.value
  const cache = new Map()

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      console.log('从缓存返回')
      return cache.get(key)
    }
    const result = originalMethod.apply(this, args)
    cache.set(key, result)
    return result
  }
}

class UserService {
  @Cacheable(60)
  getUser(id: number) {
    console.log('从数据库查询')
    return { id, name: 'Alice' }
  }
}

const service = new UserService()
console.log(service.getUser(1))  // 从数据库查询
console.log(service.getUser(1))  // 从缓存返回
```

### 参数装饰器 + 元数据

```typescript
import 'reflect-metadata'

const Body = () => (target: any, propertyKey: string, parameterIndex: number) => {
  const existingParams = Reflect.getMetadata('params', target, propertyKey) || []
  existingParams.push({ index: parameterIndex, source: 'body' })
  Reflect.defineMetadata('params', existingParams, target, propertyKey)
}

const Query = () => (target: any, propertyKey: string, parameterIndex: number) => {
  const existingParams = Reflect.getMetadata('params', target, propertyKey) || []
  existingParams.push({ index: parameterIndex, source: 'query' })
  Reflect.defineMetadata('params', existingParams, target, propertyKey)
}

class UserController {
  createUser(@Body() body: any, @Query() query: any) {
    console.log('请求体:', body)
    console.log('查询参数:', query)
  }
}

// 模拟请求处理
const controller = new UserController()
const params = Reflect.getMetadata('params', UserController.prototype, 'createUser')
console.log(params)
// [{ index: 0, source: 'body' }, { index: 1, source: 'query' }]
```

---

## 8. 常见框架中的应用

### NestJS

NestJS 大量使用 reflect-metadata 实现依赖注入和路由系统：

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common'

@Controller('users')
export class UserController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `获取用户 ${id}`
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return '创建用户'
  }
}
```

### TypeORM

TypeORM 使用 reflect-metadata 定义实体和列：

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  email: string
}
```

### InversifyJS

InversifyJS 使用 reflect-metadata 实现 IoC 容器：

```typescript
import { injectable, inject, Container } from 'inversify'

@injectable()
class Database {
  query(sql: string) { /* ... */ }
}

@injectable()
class UserRepository {
  constructor(@inject(Database) private db: Database) {}
}
```

---

## 9. 最佳实践

### 1. 入口文件导入

确保 `reflect-metadata` 在应用最开始时导入：

```typescript
// main.ts 或 index.ts
import 'reflect-metadata'  // 必须在最前面
import { createApp } from './app'
```

### 2. 使用 Symbol 作为元数据键

避免键名冲突：

```typescript
// ❌ 不好：字符串键可能冲突
Reflect.defineMetadata('route', '/api/users', target)

// ✅ 好：Symbol 保证唯一性
const ROUTE_KEY = Symbol('route')
Reflect.defineMetadata(ROUTE_KEY, '/api/users', target)
```

### 3. 创建装饰器工厂

提高装饰器的复用性：

```typescript
// ❌ 不好：硬编码值
const Cacheable = (target: any, propertyKey: string) => {
  Reflect.defineMetadata('cacheable', true, target, propertyKey)
}

// ✅ 好：可配置的装饰器工厂
const Cacheable = (ttl: number = 60) => (target: any, propertyKey: string) => {
  Reflect.defineMetadata('cacheable', true, target, propertyKey)
  Reflect.defineMetadata('cacheTtl', ttl, target, propertyKey)
}
```

### 4. 注意原型继承

使用 `getMetadata`（非 Own）可以沿原型链查找父类的元数据：

```typescript
class Base {
  // 定义元数据
}

class Child extends Base {
  // 继承元数据
}

// getMetadata 会沿原型链查找
const meta = Reflect.getMetadata('key', Child.prototype)

// getOwnMetadata 只查找自身
const ownMeta = Reflect.getOwnMetadata('key', Child.prototype)
```

### 5. 配合 TypeScript 严格模式

开启严格模式可以获得更好的类型安全：

```json
{
  "compilerOptions": {
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

## 小结

| API | 作用 | 原型链 |
|-----|------|--------|
| `defineMetadata` | 定义元数据 | — |
| `getMetadata` | 获取元数据 | ✅ 沿原型链查找 |
| `getOwnMetadata` | 获取自身元数据 | ❌ 不查找 |
| `hasMetadata` | 检查元数据 | ✅ 沿原型链查找 |
| `hasOwnMetadata` | 检查自身元数据 | ❌ 不查找 |
| `deleteMetadata` | 删除元数据 | — |
| `metadata` | 创建装饰器工厂 | — |

**预定义元数据键**：
- `design:type` — 属性类型
- `design:paramtypes` — 参数类型数组
- `design:returntype` — 返回类型

reflect-metadata 是 TypeScript 装饰器生态的核心。掌握它，你就能理解 NestJS、TypeORM 等框架的底层原理，并能创建自己的元数据驱动的装饰器系统。
