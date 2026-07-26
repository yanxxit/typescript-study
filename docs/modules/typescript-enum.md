# TypeScript 枚举（Enum）完全指南

> 枚举（Enum）是 TypeScript 中用于定义一组命名常量的特性。它允许你用有意义的名字来表示一组相关的值，提高代码的可读性和可维护性。

## 目录

1. [什么是枚举](#1-什么是枚举)
2. [数字枚举](#2-数字枚举)
3. [字符串枚举](#3-字符串枚举)
4. [异构枚举](#4-异构枚举)
5. [枚举的使用](#5-枚举的使用)
6. [反向映射](#6-反向映射)
7. [const 枚举](#7-const-枚举)
8. [枚举与联合类型](#8-枚举与联合类型)
9. [枚举的编译结果](#9-枚举的编译结果)
10. [实战案例](#10-实战案例)

---

## 1. 什么是枚举

枚举是一组**命名常量**的集合，让代码更有意义。

```typescript
// 没有枚举：使用数字或字符串，含义不明确
function setStatus(status: number) {
  if (status === 0) { /* ... */ }
  if (status === 1) { /* ... */ }
}

// 有枚举：使用有意义的名字
enum Status {
  Pending,    // 0
  Active,     // 1
  Deleted     // 2
}

function setStatus(status: Status) {
  if (status === Status.Pending) { /* ... */ }
  if (status === Status.Active) { /* ... */ }
}
```

---

## 2. 数字枚举

默认从 0 开始递增。

### 基本数字枚举

```typescript
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

console.log(Direction.Up)     // 0
console.log(Direction.Down)   // 1
```

### 指定初始值

```typescript
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4
}

console.log(Color.Red)    // 1
console.log(Color.Green)  // 2
console.log(Color.Blue)   // 4
```

### 部分指定初始值

```typescript
enum Status {
  Pending = 0,
  Active,      // 1（自动递增）
  Deleted      // 2（自动递增）
}
```

---

## 3. 字符串枚举

每个成员都必须初始化为字符串值。

```typescript
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}

console.log(Direction.Up)  // 'UP'

// 使用
function move(direction: Direction) {
  console.log(`向${direction}移动`)
}

move(Direction.Up)  // '向UP移动'
```

### 字符串枚举的优点

```typescript
// 字符串枚举在调试时更友好
enum HttpStatus {
  OK = 'OK',
  NotFound = 'Not Found',
  Error = 'Internal Server Error'
}

console.log(HttpStatus.NotFound)  // 'Not Found'（而不是数字 404）
```

---

## 4. 异构枚举

混合数字和字符串成员（不推荐）。

```typescript
enum Mixed {
  No = 0,
  Yes = 'YES'
}

console.log(Mixed.No)    // 0
console.log(Mixed.Yes)   // 'YES'
```

---

## 5. 枚举的使用

### 作为函数参数

```typescript
enum Season {
  Spring,
  Summer,
  Autumn,
  Winter
}

function getSeasonName(season: Season): string {
  switch (season) {
    case Season.Spring: return '春天'
    case Season.Summer: return '夏天'
    case Season.Autumn: return '秋天'
    case Season.Winter: return '冬天'
  }
}

console.log(getSeasonName(Season.Spring))  // '春天'
```

### 作为对象属性

```typescript
enum Role {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST'
}

interface User {
  name: string
  role: Role
}

const user: User = {
  name: 'Alice',
  role: Role.Admin
}
```

### 作为 Map 的键

```typescript
enum Color {
  Red,
  Green,
  Blue
}

const colorNames = new Map<Color, string>()
colorNames.set(Color.Red, '红色')
colorNames.set(Color.Green, '绿色')
colorNames.set(Color.Blue, '蓝色')

console.log(colorNames.get(Color.Red))  // '红色'
```

---

## 6. 反向映射

数字枚举支持从值获取成员名。

```typescript
enum Color {
  Red,    // 0
  Green,  // 1
  Blue    // 2
}

// 正向映射：成员名 → 值
console.log(Color.Red)   // 0

// 反向映射：值 → 成员名
console.log(Color[0])    // 'Red'
console.log(Color[1])    // 'Green'
console.log(Color[2])    // 'Blue'
```

### 注意：字符串枚举没有反向映射

```typescript
enum Direction {
  Up = 'UP',
  Down = 'DOWN'
}

console.log(Direction.Up)      // 'UP'
// console.log(Direction['UP'])  // undefined（没有反向映射）
```

---

## 7. const 枚举

编译后会被完全移除，用值替换成员。

```typescript
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

// 使用
const dir = Direction.Up

// 编译后变成：
// const dir = 0
```

### const 枚举的特点

```typescript
// 1. 编译时内联，不生成对象
// 2. 更小的打包体积
// 3. 不能反向映射
// 4. 不能动态访问

const enum Status {
  Pending = 0,
  Active = 1,
  Deleted = 2
}

// ✅ 正确
if (status === Status.Pending) { /* ... */ }

// ❌ 错误：不能反向映射
// console.log(Status[0])

// ❌ 错误：不能动态访问
// const key = 'Pending'
// console.log(Status[key])
```

---

## 8. 枚举与联合类型

### 使用联合类型替代简单枚举

```typescript
// 使用枚举
enum Direction {
  Up,
  Down,
  Left,
  Right
}

// 使用联合类型（更轻量）
type Direction2 = 'up' | 'down' | 'left' | 'right'

// 两者都可以
function move(dir: Direction) { /* ... */ }
function move2(dir: Direction2) { /* ... */ }
```

### 选择建议

| 场景 | 推荐 |
|------|------|
| 简单字符串常量 | 联合类型 |
| 需要数字映射 | 枚举 |
| 需要反向映射 | 枚举 |
| 需要运行时值 | 枚举 |
| 极致包体积 | const 枚举 或 联合类型 |

---

## 9. 枚举的编译结果

### 普通枚举

```typescript
// TypeScript
enum Color {
  Red,
  Green,
  Blue
}

// 编译后 JavaScript
var Color;
(function (Color) {
  Color[Color["Red"] = 0] = "Red";
  Color[Color["Green"] = 1] = "Green";
  Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
```

### const 枚举

```typescript
// TypeScript
const enum Color {
  Red,
  Green,
  Blue
}

// 编译后 JavaScript（内联）
const color = 0;  // Color.Red 被替换为 0
```

### 字符串枚举

```typescript
// TypeScript
enum Direction {
  Up = 'UP',
  Down = 'DOWN'
}

// 编译后 JavaScript
var Direction;
(function (Direction) {
  Direction["Up"] = "UP";
  Direction["Down"] = "DOWN";
})(Direction || (Direction = {}));
```

---

## 10. 实战案例

### 案例 1：订单状态机

```typescript
enum OrderStatus {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED'
}

interface Order {
  id: string
  status: OrderStatus
  createdAt: Date
}

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const transitions: Record<OrderStatus, OrderStatus | null> = {
    [OrderStatus.Pending]: OrderStatus.Processing,
    [OrderStatus.Processing]: OrderStatus.Shipped,
    [OrderStatus.Shipped]: OrderStatus.Delivered,
    [OrderStatus.Delivered]: null,
    [OrderStatus.Cancelled]: null
  }
  return transitions[current]
}

function transitionOrder(order: Order): boolean {
  const nextStatus = getNextStatus(order.status)
  if (nextStatus) {
    order.status = nextStatus
    return true
  }
  return false
}
```

### 案例 2：权限系统

```typescript
enum Permission {
  Read = 1 << 0,    // 1
  Write = 1 << 1,   // 2
  Execute = 1 << 2, // 4
  Admin = 1 << 3    // 8
}

// 组合权限
function combinePermissions(...perms: Permission[]): number {
  return perms.reduce((acc, p) => acc | p, 0)
}

// 检查权限
function hasPermission(userPerm: number, required: Permission): boolean {
  return (userPerm & required) === required
}

// 使用
const userPermissions = combinePermissions(Permission.Read, Permission.Write)
console.log(hasPermission(userPermissions, Permission.Read))    // true
console.log(hasPermission(userPermissions, Permission.Execute)) // false
```

### 案例 3：API 错误码

```typescript
enum ErrorCode {
  // 客户端错误 4xx
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Validation = 422,

  // 服务端错误 5xx
  Internal = 500,
  ServiceUnavailable = 503
}

interface ApiError {
  code: ErrorCode
  message: string
  details?: any
}

function createError(code: ErrorCode, message: string, details?: any): ApiError {
  return { code, message, details }
}

// 使用
const notFoundError = createError(ErrorCode.NotFound, '用户不存在')
const authError = createError(ErrorCode.Unauthorized, '请先登录')
```

### 案例 4：配置选项

```typescript
enum LogLevel {
  Debug = 'DEBUG',
  Info = 'INFO',
  Warn = 'WARN',
  Error = 'ERROR'
}

interface Config {
  level: LogLevel
  timestamp: boolean
  colorize: boolean
}

function createLogger(config: Config) {
  return {
    debug: (msg: string) => {
      if (config.level === LogLevel.Debug) {
        console.log(`[DEBUG] ${msg}`)
      }
    },
    info: (msg: string) => {
      if (config.level === LogLevel.Info || config.level === LogLevel.Debug) {
        console.log(`[INFO] ${msg}`)
      }
    },
    warn: (msg: string) => {
      console.warn(`[WARN] ${msg}`)
    },
    error: (msg: string) => {
      console.error(`[ERROR] ${msg}`)
    }
  }
}

const logger = createLogger({
  level: LogLevel.Info,
  timestamp: true,
  colorize: false
})

logger.info('服务器启动')
logger.debug('调试信息')  // 不会输出
```

---

## 小结

| 类型 | 特点 | 适用场景 |
|------|------|----------|
| 数字枚举 | 默认从 0 递增，支持反向映射 | 需要数字值的场景 |
| 字符串枚举 | 每个成员都是字符串 | 调试友好，日志输出 |
| const 枚举 | 编译时内联，无运行时对象 | 极致包体积 |
| 联合类型 | 轻量，无运行时开销 | 简单字符串常量 |

**最佳实践**：
- 优先使用字符串枚举（调试友好）
- 简单常量考虑用联合类型替代
- 需要反向映射时使用数字枚举
- 追求包体积时使用 const 枚举
- 枚举名用 PascalCase，成员用 PascalCase 或 UPPER_CASE
