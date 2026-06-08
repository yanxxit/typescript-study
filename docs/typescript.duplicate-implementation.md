# TypeScript 函数实现重复与全局作用域污染

## 问题现象

在 TypeScript 项目中，当我们定义了一个函数、类或变量时，有时会遇到如下的编译错误：

```
error TS2393: Duplicate function implementation.
error TS2300: Duplicate identifier 'xxx'.
```

例如，在 `fileA.ts` 中定义了 `class Animal {}`，而在 `fileB.ts` 中也定义了 `class Animal {}`，此时 TypeScript 会报错提示标识符重复。

## 根本原因

产生此问题的根本原因在于 **TypeScript 的模块解析机制与全局作用域污染**。

在 TypeScript 中，如果一个 `.ts` 文件内**没有任何 `import` 或 `export` 语句**，TypeScript 会默认将其视为一个**全局脚本（Global Script）**。
这意味着该文件中定义的所有变量、函数、类、接口等都会被直接暴露在**全局作用域**中。

当项目中存在多个这样的全局脚本，且它们恰好声明了同名的标识符时，编译器在编译整个项目时就会在全局作用域中发现冲突，从而抛出 `ts(2393)`（函数实现重复）或 `ts(2300)`（标识符重复）错误。

## 解决方案

解决全局作用域污染的核心思路是：**将全局脚本转换为独立的模块（Module）**。模块拥有自己独立的作用域，内部声明的标识符即使同名也不会与其他模块发生冲突。

### 方案一：强制声明为模块（最简单）

如果在当前文件中确实不需要导出任何内容，也不需要导入任何依赖，只需在文件末尾显式加入一个空的导出语句即可：

```typescript
// 你的代码
function withLogging(fn: Function) {
    return fn;
}

// 强制 TypeScript 将此文件视为模块
export {};
```

### 方案二：使用标准的 ES Modules 导入导出（推荐）

对于需要在多个文件之间共享的代码，应该使用规范的 `import` 和 `export` 语法：

```typescript
// utils.ts
export function withLogging(fn: Function) {
    return fn;
}
```

```typescript
// app.ts
import { withLogging } from './utils';

const myFunc = withLogging(() => console.log('hello'));
```

### 方案三：通过 tsconfig.json 隔离（临时方案）

如果你有多个独立的练习或测试脚本，且不想将它们作为模块，可以通过在 `tsconfig.json` 中配置 `exclude` 字段，将这些文件排除在项目的全局编译范围之外（但这只是掩盖了问题，不推荐在正式项目中使用）：

```json
{
  "exclude": [
    "src/test1.ts",
    "src/test2.ts"
  ]
}
```

## 总结

- 没有 `import/export` 的 `.ts` 文件是全局脚本，其中的声明会污染全局作用域。
- 使用 `export {};` 可以快速将一个脚本转换为拥有独立作用域的模块。
- 现代 TypeScript 开发中，应始终坚持使用 ES Modules 规范，通过模块化的方式来组织代码，从根本上避免命名冲突。
