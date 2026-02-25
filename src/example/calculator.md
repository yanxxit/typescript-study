# TypeScript 计算器文档

## 概述

这是一个使用 TypeScript 编写的简单计算器，提供了基本的算术运算功能，包括加法、减法、乘法、除法以及表达式计算。

## 目录结构

```sh
src/example/
├── calculator.ts  # 计算器实现
└── calculator.md  # 计算器文档
```

## 安装和使用

### 前提条件

- Node.js
- TypeScript
- ts-node-dev (用于运行 TypeScript 文件)

### 运行示例

```bash
# 使用 ts-node-dev 运行计算器示例
npm run exec1

# 或者直接运行
npx ts-node-dev src/example/calculator.ts
ts-node src/example/calculator.ts
```

## API 文档

### Calculator 类

#### 构造函数

```typescript
new Calculator()
```

创建一个新的计算器实例。

#### 方法

##### add(a: number, b: number): number

执行加法运算。

- **参数**：
  - `a`: 第一个加数
  - `b`: 第二个加数
- **返回值**：两个数的和

##### subtract(a: number, b: number): number

执行减法运算。

- **参数**：
  - `a`: 被减数
  - `b`: 减数
- **返回值**：两个数的差

##### multiply(a: number, b: number): number

执行乘法运算。

- **参数**：
  - `a`: 第一个乘数
  - `b`: 第二个乘数
- **返回值**：两个数的积

##### divide(a: number, b: number): number

执行除法运算。

- **参数**：
  - `a`: 被除数
  - `b`: 除数
- **返回值**：两个数的商
- **异常**：当除数为0时抛出错误

##### evaluate(expression: string): number

执行算术表达式计算。

- **参数**：
  - `expression`: 算术表达式字符串，支持 +, -, *, / 运算
- **返回值**：表达式的计算结果
- **异常**：当表达式格式错误或除数为0时抛出错误

## 使用示例

### 基本运算

```typescript
import { Calculator } from './calculator';

const calculator = new Calculator();

// 加法
console.log('1 + 2 =', calculator.add(1, 2)); // 输出: 1 + 2 = 3

// 减法
console.log('5 - 3 =', calculator.subtract(5, 3)); // 输出: 5 - 3 = 2

// 乘法
console.log('4 * 6 =', calculator.multiply(4, 6)); // 输出: 4 * 6 = 24

// 除法
console.log('8 / 2 =', calculator.divide(8, 2)); // 输出: 8 / 2 = 4
```

### 表达式计算

```typescript
import { Calculator } from './calculator';

const calculator = new Calculator();

try {
  // 计算表达式
  console.log('10 + 5 =', calculator.evaluate('10 + 5')); // 输出: 10 + 5 = 15
  console.log('20 * 3 =', calculator.evaluate('20 * 3')); // 输出: 20 * 3 = 60
  console.log('15 / 3 =', calculator.evaluate('15 / 3')); // 输出: 15 / 3 = 5
} catch (error) {
  console.error('计算错误:', (error as Error).message);
}
```

## 错误处理

- **除数为0**：当调用 `divide` 方法或 `evaluate` 方法计算除法表达式时，如果除数为0，会抛出错误。
- **表达式格式错误**：当调用 `evaluate` 方法时，如果表达式格式不正确，会抛出错误。

## 注意事项

- `evaluate` 方法目前仅支持两个数的运算，不支持复杂表达式。
- 所有方法都支持浮点数运算。
- 请确保传入的参数类型正确，否则 TypeScript 编译器会报错。

## 扩展建议

- 添加更多数学函数，如平方根、幂运算等。
- 增强 `evaluate` 方法，支持复杂表达式和括号。
- 添加单位转换功能。
- 实现图形界面。
