# TypeScript 装饰器（Decorators）完全指南

> 装饰器（Decorators）是一种特殊类型的声明，可以附加到类声明、方法、属性或参数上，用于修改或扩展它们的行为。装饰器是 TypeScript 中最强大的元编程特性之一。

## 目录

1. [什么是装饰器](#1-什么是装饰器)
2. [启用装饰器](#2-启用装饰器)
3. [类装饰器](#3-类装饰器)
4. [方法装饰器](#4-方法装饰器)
5. [访问器装饰器](#5-访问器装饰器)
6. [属性装饰器](#6-属性装饰器)
7. [参数装饰器](#7-参数装饰器)
8. [装饰器工厂](#8-装饰器工厂)
9. [装饰器组合](#9-装饰器组合)
10. [实战案例](#10-实战案例)

---

## 1. 什么是装饰器

装饰器是一种**声明式语法**，用于在不修改原始代码的情况下添加功能。

```typescript
// 没有装饰器
class UserService {
  getUser(id: number) {
    console.log(`获取用户 ${id}`)
    return { id, name: 'Alice' }
  }
}

// 有装饰器
class UserService {
  @Log  // 自动记录日志
  getUser(id: number) {
    console.log(`获取用户 ${id}`)
    return { id, name: 'Alice' }
  }
}
```

---

## 2. 启用装饰器

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
| `emitDecoratorMetadata` | 自动生成元数据（配合 reflect-metadata） |

---

## 3. 类装饰器

类装饰器应用于**类的构造函数**，可以观察、修改或替换类定义。

### 基本类装饰器

```typescript
function Sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@Sealed
class Greeter {
  constructor(public greeting: string) {}
  greet() {
    return 'Hello, ' + this.greeting
  }
}

// Greeter 类被密封，不能添加新属性
```

### 修改类

```typescript
function AddTimestamp<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    createdAt = new Date()
  }
}

@AddTimestamp
class User {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

const user = new User('Alice')
console.log(user.createdAt)  // Date 对象
```

### 替换类

```typescript
function Logger<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    log() {
      console.log(`创建了 ${constructor.name} 实例`)
    }
  }
}

@Logger
class User {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

const user = new User('Alice')
user.log()  // "创建了 User 实例"
```

---

## 4. 方法装饰器

方法装饰器应用于**方法的属性描述符**，可以观察、修改或替换方法定义。

### 基本方法装饰器

```typescript
function Log(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
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

const calc = new Calculator()
calc.add(5, 3)
// 调用 add
// 参数: [5,3]
// 结果: 8
```

### 方法装饰器参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `target` | `Object` | 类的原型（对于实例方法）或构造函数（对于静态方法） |
| `propertyKey` | `string` | 方法名 |
| `descriptor` | `PropertyDescriptor` | 方法的属性描述符 |

---

## 5. 访问器装饰器

访问器装饰器应用于**访问器的属性描述符**，语法与方法装饰器相同。

```typescript
function ReadOnly(target: any, key: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false
  return descriptor
}

class Circle {
  private _radius: number

  constructor(radius: number) {
    this._radius = radius
  }

  @ReadOnly
  get radius() {
    return this._radius
  }
}

const circle = new Circle(10)
console.log(circle.radius)  // 10
// circle.radius = 20  // ❌ 只读访问器
```

---

## 6. 属性装饰器

属性装饰器应用于**属性声明**，但不能直接修改属性值。

```typescript
function Validate(target: any, propertyKey: string) {
  let value: any

  const getter = () => value
  const setter = (newVal: any) => {
    if (typeof newVal !== 'string') {
      throw new TypeError(`${propertyKey} 必须是字符串`)
    }
    value = newVal
  }

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter
  })
}

class User {
  @Validate
  name: string

  constructor(name: string) {
    this.name = name
  }
}

const user = new User('Alice')  // ✅
// const user2 = new User(123)  // ❌ TypeError
```

### 属性装饰器参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `target` | `Object` | 类的原型（对于实例属性）或构造函数（对于静态属性） |
| `propertyKey` | `string` | 属性名 |

---

## 7. 参数装饰器

参数装饰器应用于**方法的参数**。

```typescript
function Required(target: any, propertyKey: string, parameterIndex: number) {
  const existingRequiredParameters = Reflect.getMetadata('required', target, propertyKey) || []
  existingRequiredParameters.push(parameterIndex)
  Reflect.defineMetadata('required', existingRequiredParameters, target, propertyKey)
}

function ValidateParams(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const requiredParameters = Reflect.getMetadata('required', target, propertyKey) || []

    for (const parameterIndex of requiredParameters) {
      if (parameterIndex >= args.length || args[parameterIndex] === undefined) {
        throw new Error(`缺少必填参数`)
      }
    }

    return originalMethod.apply(this, args)
  }

  return descriptor
}

class UserService {
  @ValidateParams
  createUser(@Required name: string, @Required email: string) {
    return { name, email }
  }
}

const service = new UserService()
service.createUser('Alice', 'alice@example.com')  // ✅
// service.createUser('Alice')  // ❌ 缺少必填参数
```

---

## 8. 装饰器工厂

装饰器工厂是**返回装饰器的函数**，可以传递参数。

### 基本装饰器工厂

```typescript
function Log(method: string) {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
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

  @Log('POST')
  createUser(data: any) { /* ... */ }
}
```

### 带参数的装饰器工厂

```typescript
function Throttle(delay: number) {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    let lastCall = 0

    descriptor.value = function (...args: any[]) {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        return originalMethod.apply(this, args)
      }
    }

    return descriptor
  }
}

class SearchService {
  @Throttle(300)
  search(query: string) {
    console.log(`搜索: ${query}`)
  }
}
```

---

## 9. 装饰器组合

多个装饰器可以应用到同一个目标，从下到上执行。

```typescript
function A() {
  console.log('A: 工厂执行')
  return function (target: any) {
    console.log('A: 装饰器执行')
  }
}

function B() {
  console.log('B: 工厂执行')
  return function (target: any) {
    console.log('B: 装饰器执行')
  }
}

@A()
@B()
class MyClass {}

// 输出：
// A: 工厂执行
// B: 工厂执行
// B: 装饰器执行
// A: 装饰器执行
```

---

## 10. 实战案例

### 案例 1：日志装饰器

```typescript
function Log(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const startTime = performance.now()

    console.log(`[调用] ${propertyKey}`)
    console.log(`  入参：`, JSON.stringify(args))

    const result = originalMethod.apply(this, args)

    const endTime = performance.now()
    console.log(`  出参：`, JSON.stringify(result))
    console.log(`  耗时：${(endTime - startTime).toFixed(4)} ms`)

    return result
  }

  return descriptor
}

class UserService {
  @Log
  getUserById(id: number): object {
    return { id, name: `User${id}` }
  }
}
```

### 案例 2：缓存装饰器

```typescript
function Cache(ttl: number = 60000) {
  const cache = new Map<string, { value: any; expiry: number }>()

  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const key = `${propertyKey}:${JSON.stringify(args)}`
      const cached = cache.get(key)

      if (cached && Date.now() < cached.expiry) {
        console.log(`[Cache] 命中缓存: ${propertyKey}`)
        return cached.value
      }

      const result = originalMethod.apply(this, args)
      cache.set(key, { value: result, expiry: Date.now() + ttl })

      console.log(`[Cache] 设置缓存: ${propertyKey}`)
      return result
    }

    return descriptor
  }
}

class ProductService {
  @Cache(30000)
  getProduct(id: number) {
    console.log(`从数据库查询产品 ${id}`)
    return { id, name: 'Product' }
  }
}
```

### 案例 3：重试装饰器

```typescript
function Retry(maxRetries: number = 3, delay: number = 1000) {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      let lastError: Error

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await originalMethod.apply(this, args)
        } catch (error) {
          lastError = error as Error
          console.log(`[Retry] 第 ${attempt} 次尝试失败: ${error}`)

          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }
      }

      throw lastError!
    }

    return descriptor
  }
}

class ApiClient {
  @Retry(3, 1000)
  async fetchData(url: string) {
    const response = await fetch(url)
    if (!response.ok) throw new Error('请求失败')
    return response.json()
  }
}
```

### 案例 4：验证装饰器

```typescript
function ValidateEmail(target: any, propertyKey: string) {
  let value: string

  const getter = () => value
  const setter = (newVal: string) => {
    if (!newVal.includes('@')) {
      throw new TypeError('邮箱格式不正确')
    }
    value = newVal
  }

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter
  })
}

function ValidateRange(min: number, max: number) {
  return function (target: any, propertyKey: string) {
    let value: number

    const getter = () => value
    const setter = (newVal: number) => {
      if (newVal < min || newVal > max) {
        throw new TypeError(`${propertyKey} 必须在 ${min} 和 ${max} 之间`)
      }
      value = newVal
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter
    })
  }
}

class User {
  @ValidateEmail
  email: string

  @ValidateRange(0, 150)
  age: number

  constructor(email: string, age: number) {
    this.email = email
    this.age = age
  }
}

const user = new User('alice@example.com', 25)  // ✅
// const user2 = new User('invalid', 25)  // ❌ TypeError
```

### 案例 5：权限装饰器

```typescript
const PERMISSION_KEY = Symbol('permission')

function RequirePermission(permission: string) {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(PERMISSION_KEY, permission, target, propertyKey)
    return descriptor
  }
}

function CheckPermission(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const requiredPermission = Reflect.getMetadata(PERMISSION_KEY, target, propertyKey)

    if (requiredPermission) {
      const userPermissions = ['read', 'write']  // 模拟用户权限
      if (!userPermissions.includes(requiredPermission)) {
        throw new Error(`需要权限: ${requiredPermission}`)
      }
    }

    return originalMethod.apply(this, args)
  }

  return descriptor
}

class Document {
  @RequirePermission('read')
  @CheckPermission
  view() {
    return '查看文档'
  }

  @RequirePermission('write')
  @CheckPermission
  edit() {
    return '编辑文档'
  }

  @RequirePermission('admin')
  @CheckPermission
  delete() {
    return '删除文档'
  }
}
```

---

## 小结

| 装饰器类型 | 参数 | 应用场景 |
|-----------|------|----------|
| 类装饰器 | `constructor` | 修改类定义、添加属性 |
| 方法装饰器 | `target, key, descriptor` | 日志、缓存、重试、权限 |
| 访问器装饰器 | `target, key, descriptor` | 只读控制、验证 |
| 属性装饰器 | `target, key` | 验证、默认值 |
| 参数装饰器 | `target, key, index` | 必填参数、参数验证 |

**最佳实践**：
- 使用装饰器工厂传递参数
- 装饰器应该是纯函数，避免副作用
- 合理使用 `reflect-metadata` 获取类型信息
- 装饰器顺序：从下到上，从内到外
- 保持装饰器职责单一
