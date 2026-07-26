# TypeScript 类（Classes）完全指南

> 类（Class）是 TypeScript 中面向对象编程的核心。它定义了对象的蓝图，包含属性和方法。TypeScript 在 JavaScript 类的基础上增加了访问修饰符、抽象类、接口实现等特性。

## 目录

1. [什么是类](#1-什么是类)
2. [构造函数](#2-构造函数)
3. [访问修饰符](#3-访问修饰符)
4. [只读属性](#4-只读属性)
5. [参数属性](#5-参数属性)
6. [Getter/Setter](#6-gettersetter)
7. [静态成员](#7-静态成员)
8. [继承（extends）](#8-继承extends)
9. [抽象类](#9-抽象类)
10. [实现接口（implements）](#10-实现接口implements)
11. [混入（Mixins）](#11-混入mixins)
12. [实战案例](#12-实战案例)

---

## 1. 什么是类

类是对象的蓝图，定义了对象的属性和行为。

```typescript
class User {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  greet(): string {
    return `Hello, ${this.name}`
  }
}

const user = new User('Alice', 30)
console.log(user.greet())  // "Hello, Alice"
```

---

## 2. 构造函数

### 基本构造函数

```typescript
class User {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}
```

### 参数属性（简写）

TypeScript 允许在构造函数参数前添加修饰符，自动声明并赋值属性。

```typescript
// 完整写法
class User {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

// 简写（参数属性）
class User {
  constructor(
    public name: string,
    public age: number
  ) {}
}
```

### 构造函数重载

```typescript
class User {
  name: string
  age: number

  constructor(name: string)
  constructor(name: string, age: number)
  constructor(name: string, age?: number) {
    this.name = name
    this.age = age ?? 0
  }
}

const user1 = new User('Alice')
const user2 = new User('Bob', 25)
```

---

## 3. 访问修饰符

| 修饰符 | 类内部 | 子类 | 类外部 |
|--------|--------|------|--------|
| `public` | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ❌ |
| `private` | ✅ | ❌ | ❌ |

### public（默认）

```typescript
class User {
  public name: string  // 默认就是 public

  constructor(name: string) {
    this.name = name
  }
}

const user = new User('Alice')
console.log(user.name)  // ✅
```

### private

```typescript
class User {
  private password: string

  constructor(password: string) {
    this.password = password
  }

  checkPassword(pwd: string): boolean {
    return this.password === pwd
  }
}

const user = new User('123456')
// console.log(user.password)  // ❌ 私有属性
user.checkPassword('123456')   // ✅
```

### protected

```typescript
class Person {
  protected name: string

  constructor(name: string) {
    this.name = name
  }
}

class Employee extends Person {
  greet(): string {
    return `Hello, ${this.name}`  // ✅ 子类可以访问
  }
}

const emp = new Employee('Alice')
// console.log(emp.name)  // ❌ 类外部不能访问
```

---

## 4. 只读属性

```typescript
class User {
  readonly id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}

const user = new User(1, 'Alice')
user.name = 'Bob'      // ✅
// user.id = 2          // ❌ 只读属性
```

---

## 5. 参数属性

通过构造函数参数直接声明属性。

```typescript
// 传统写法
class User {
  public name: string
  private age: number
  protected email: string
  readonly id: number

  constructor(name: string, age: number, email: string, id: number) {
    this.name = name
    this.age = age
    this.email = email
    this.id = id
  }
}

// 参数属性简写
class User {
  constructor(
    public name: string,
    private age: number,
    protected email: string,
    readonly id: number
  ) {}
}
```

---

## 6. Getter/Setter

```typescript
class User {
  private _name: string

  constructor(name: string) {
    this._name = name
  }

  get name(): string {
    return this._name
  }

  set name(value: string) {
    if (value.length < 2) {
      throw new Error('名字至少 2 个字符')
    }
    this._name = value
  }
}

const user = new User('Alice')
console.log(user.name)  // 'Alice'（调用 getter）
user.name = 'Bob'       // 调用 setter
// user.name = 'A'      // ❌ 抛出错误
```

---

## 7. 静态成员

```typescript
class MathUtils {
  static PI = 3.14159

  static add(a: number, b: number): number {
    return a + b
  }

  static multiply(a: number, b: number): number {
    return a * b
  }
}

console.log(MathUtils.PI)           // 3.14159
console.log(MathUtils.add(1, 2))    // 3

// const utils = new MathUtils()  // 通常不需要实例化
```

### 静态属性

```typescript
class User {
  static count = 0

  constructor(public name: string) {
    User.count++
  }
}

new User('Alice')
new User('Bob')
console.log(User.count)  // 2
```

---

## 8. 继承（extends）

```typescript
class Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  move(distance: number = 0): void {
    console.log(`${this.name} 移动了 ${distance} 米`)
  }
}

class Dog extends Animal {
  breed: string

  constructor(name: string, breed: string) {
    super(name)  // 调用父类构造函数
    this.breed = breed
  }

  bark(): void {
    console.log('汪汪汪！')
  }

  move(distance: number = 5): void {
    console.log('跑着移动...')
    super.move(distance)  // 调用父类方法
  }
}

const dog = new Dog('Rex', 'German Shepherd')
dog.bark()       // '汪汪汪！'
dog.move(10)     // '跑着移动...' 'Rex 移动了 10 米'
```

---

## 9. 抽象类

抽象类不能直接实例化，只能被继承。

```typescript
abstract class Shape {
  color: string

  constructor(color: string) {
    this.color = color
  }

  abstract area(): number
  abstract perimeter(): number

  describe(): string {
    return `${this.color} 形状，面积 ${this.area()}`
  }
}

class Circle extends Shape {
  constructor(color: string, private radius: number) {
    super(color)
  }

  area(): number {
    return Math.PI * this.radius ** 2
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius
  }
}

class Rectangle extends Shape {
  constructor(color: string, private width: number, private height: number) {
    super(color)
  }

  area(): number {
    return this.width * this.height
  }

  perimeter(): number {
    return 2 * (this.width + this.height)
  }
}

const circle = new Circle('红色', 10)
console.log(circle.describe())  // '红色 形状，面积 314.159...'
```

---

## 10. 实现接口（implements）

```typescript
interface Printable {
  print(): void
}

interface Loggable {
  log(message: string): void
}

class Document implements Printable, Loggable {
  constructor(public title: string) {}

  print(): void {
    console.log(`打印: ${this.title}`)
  }

  log(message: string): void {
    console.log(`[${this.title}] ${message}`)
  }
}
```

### 接口与类的关系

```typescript
interface Repository<T> {
  findById(id: string): T | null
  findAll(): T[]
  save(entity: T): void
  delete(id: string): boolean
}

interface User {
  id: string
  name: string
}

class UserRepository implements Repository<User> {
  private users: User[] = []

  findById(id: string): User | null {
    return this.users.find(u => u.id === id) || null
  }

  findAll(): User[] {
    return this.users
  }

  save(user: User): void {
    this.users.push(user)
  }

  delete(id: string): boolean {
    const index = this.users.findIndex(u => u.id === id)
    if (index !== -1) {
      this.users.splice(index, 1)
      return true
    }
    return false
  }
}
```

---

## 11. 混入（Mixins）

```typescript
type Constructor<T = {}> = new (...args: any[]) => T

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date()
    updatedAt = new Date()
  }
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false

    activate() {
      this.isActive = true
    }

    deactivate() {
      this.isActive = false
    }
  }
}

class Base {
  name = ''
}

// 组合混入
const TimestampedActivatable = Timestamped(Activatable(Base))

const obj = new TimestampedActivatable()
obj.name = 'test'
obj.activate()
console.log(obj.isActive)   // true
console.log(obj.createdAt)  // Date 对象
```

---

## 12. 实战案例

### 案例 1：单例模式

```typescript
class Singleton {
  private static instance: Singleton

  private constructor(public value: number) {}

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton(42)
    }
    return Singleton.instance
  }
}

const a = Singleton.getInstance()
const b = Singleton.getInstance()
console.log(a === b)  // true
```

### 案例 2：工厂模式

```typescript
interface Product {
  name: string
  price: number
}

class Phone implements Product {
  constructor(public name: string, public price: number) {}
}

class Laptop implements Product {
  constructor(public name: string, public price: number) {}
}

class ProductFactory {
  static create(type: 'phone' | 'laptop', name: string, price: number): Product {
    switch (type) {
      case 'phone':
        return new Phone(name, price)
      case 'laptop':
        return new Laptop(name, price)
    }
  }
}

const phone = ProductFactory.create('phone', 'iPhone', 999)
```

### 案例 3：观察者模式

```typescript
type EventCallback = (data: any) => void

class EventEmitter {
  private events = new Map<string, EventCallback[]>()

  on(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event) || []
    callbacks.push(callback)
    this.events.set(event, callbacks)
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event) || []
    this.events.set(event, callbacks.filter(cb => cb !== callback))
  }

  emit(event: string, data: any): void {
    const callbacks = this.events.get(event) || []
    callbacks.forEach(cb => cb(data))
  }
}

class UserService extends EventEmitter {
  createUser(name: string) {
    const user = { id: Date.now(), name }
    this.emit('user:created', user)
    return user
  }
}

const service = new UserService()
service.on('user:created', (user) => {
  console.log('新用户:', user)
})
service.createUser('Alice')
```

### 案例 4：建造者模式

```typescript
class RequestBuilder {
  private url = ''
  private method = 'GET'
  private headers: Record<string, string> = {}
  private body: any = null

  setUrl(url: string): this {
    this.url = url
    return this
  }

  setMethod(method: string): this {
    this.method = method
    return this
  }

  setHeader(key: string, value: string): this {
    this.headers[key] = value
    return this
  }

  setBody(body: any): this {
    this.body = body
    return this
  }

  build(): { url: string; method: string; headers: Record<string, string>; body: any } {
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
      body: this.body
    }
  }
}

const request = new RequestBuilder()
  .setUrl('https://api.example.com/users')
  .setMethod('POST')
  .setHeader('Content-Type', 'application/json')
  .setBody({ name: 'Alice' })
  .build()
```

---

## 小结

| 特性 | 语法 | 说明 |
|------|------|------|
| 构造函数 | `constructor()` | 初始化实例 |
| 参数属性 | `public/private/protected/readonly x: T` | 简写声明 |
| 访问修饰符 | `public/private/protected` | 控制访问权限 |
| 只读 | `readonly` | 不可修改 |
| Getter/Setter | `get/set` | 访问器 |
| 静态成员 | `static` | 类级别 |
| 继承 | `extends` | 子类继承父类 |
| 抽象类 | `abstract class` | 不能实例化 |
| 接口实现 | `implements` | 实现契约 |

**最佳实践**：
- 优先使用参数属性简写
- 用 `private` 保护内部状态
- 用 `readonly` 表示不可变属性
- 用抽象类定义通用行为
- 用接口定义契约
- 考虑使用混入实现代码复用
