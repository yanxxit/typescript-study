# TypeScript 6.0 新特性完全指南

> TypeScript 6.0 是一个重要的过渡版本，为 TypeScript 7.0（原生编译器）做准备。它引入了新特性、新的默认值，以及一系列废弃和破坏性变更。

## 目录

1. [新特性概览](#1-新特性概览)
2. [this-less 函数推断改进](#2-this-less-函数推断改进)
3. [Subpath Imports 以 #/ 开头](#3-subpath-imports-以-开头)
4. [moduleResolution bundler + module commonjs](#4-moduleresolution-bundler--module-commonjs)
5. [es2025 目标和库](#5-es2025-目标和库)
6. [Temporal API 类型](#6-temporal-api-类型)
7. [Map 的 getOrInsert 方法](#7-map-的-getorinsert-方法)
8. [RegExp.escape](#8-regexpescape)
9. [dom 库包含 dom.iterable](#9-dom-库包含-domiterable)
10. [破坏性变更与废弃](#10-破坏性变更与废弃)
11. [迁移到 TypeScript 6.0](#11-迁移到-typescript-60)

---

## 1. 新特性概览

| 特性 | 说明 |
|------|------|
| this-less 函数推断 | 改进无 this 函数的类型推断 |
| Subpath Imports `#/` | 支持以 `#/` 开头的子路径导入 |
| bundler + commonjs | moduleResolution bundler 可与 module commonjs 组合使用 |
| es2025 | 新增 ES2025 目标和库 |
| Temporal API | 内置 Temporal 类型 |
| getOrInsert | Map 的 upsert 方法 |
| RegExp.escape | 正则表达式转义函数 |
| dom.iterable | dom 库自动包含 dom.iterable |

---

## 2. this-less 函数推断改进

TypeScript 6.0 改进了无 `this` 函数的类型推断。

### 问题场景

```typescript
declare function callIt<T>(obj: {
  produce: (x: number) => T
  consume: (y: T) => void
}): void

// ✅ 箭头函数：正常工作
callIt({
  consume: y => y.toFixed(),
  produce: (x: number) => x * 2
})

// ❌ 方法语法（TS 5.x）：报错
callIt({
  consume(y) { return y.toFixed() },  // y 是 unknown
  produce(x: number) { return x * 2 }
})
```

### TypeScript 6.0 的改进

```typescript
// ✅ TypeScript 6.0：方法语法也能正常工作
callIt({
  consume(y) { return y.toFixed() },  // y 正确推断为 number
  produce(x: number) { return x * 2 }
})
```

**原理**：TypeScript 6.0 检查函数是否实际使用了 `this`。如果函数没有使用 `this`，则不将其视为上下文敏感函数，从而优先参与类型推断。

---

## 3. Subpath Imports 以 #/ 开头

支持以 `#/` 开头的子路径导入。

### 之前

```json
{
  "imports": {
    "#root/*": "./dist/*"
  }
}
```

### 现在

```json
{
  "imports": {
    "#/*": "./dist/*"
  }
}
```

```typescript
// 使用
import * as utils from '#/utils.js'
// 等同于
import * as utils from '../../utils.js'
```

**要求**：`moduleResolution` 设置为 `nodenext` 或 `bundler`。

---

## 4. moduleResolution bundler + module commonjs

`--moduleResolution bundler` 现在可以与 `--module commonjs` 组合使用。

### 之前

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "esnext"  // 只能是 esnext 或 preserve
  }
}
```

### 现在

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "commonjs"  // ✅ 现在支持
  }
}
```

**说明**：这是从 `moduleResolution: node` 迁移的推荐路径。

---

## 5. es2025 目标和库

新增 `es2025` 选项，支持新的内置 API 类型。

```json
{
  "compilerOptions": {
    "target": "es2025",
    "lib": ["es2025"]
  }
}
```

**新增类型**：
- `RegExp.escape`
- `Promise.try`
- `Iterator` 方法
- `Set` 方法

---

## 6. Temporal API 类型

内置 Temporal API 类型（Stage 4）。

```typescript
// 需要 target: esnext 或 lib: ["esnext"]
let yesterday = Temporal.Now.instant().subtract({ hours: 24 })
let tomorrow = Temporal.Now.instant().add({ hours: 24 })

console.log(`Yesterday: ${yesterday}`)
console.log(`Tomorrow: ${tomorrow}`)
```

```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["esnext"]
  }
}
```

---

## 7. Map 的 getOrInsert 方法

Map 新增 `getOrInsert` 和 `getOrInsertComputed` 方法。

### 之前

```typescript
function processOptions(options: Map<string, unknown>) {
  let value: unknown
  if (options.has('strict')) {
    value = options.get('strict')
  } else {
    value = true
    options.set('strict', value)
  }
}
```

### 现在

```typescript
function processOptions(options: Map<string, unknown>) {
  const value = options.getOrInsert('strict', true)
}

// 使用计算函数
const value = someMap.getOrInsertComputed('key', () => {
  return computeExpensiveValue()
})
```

---

## 8. RegExp.escape

新增 `RegExp.escape` 函数，自动转义正则表达式特殊字符。

```typescript
function matchWholeWord(word: string, text: string) {
  const escapedWord = RegExp.escape(word)
  const regex = new RegExp(`\\b${escapedWord}\\b`, 'g')
  return text.match(regex)
}

// 使用 es2025
matchWholeWord('hello', 'hello world')  // 匹配 'hello'
```

---

## 9. dom 库包含 dom.iterable

`dom` 库现在自动包含 `dom.iterable` 和 `dom.asynciterable`。

### 之前

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable"]  // 需要显式添加
  }
}
```

### 现在

```json
{
  "compilerOptions": {
    "lib": ["dom"]  // ✅ 自动包含 dom.iterable
  }
}
```

```typescript
// 现在可以直接迭代 DOM 集合
for (const element of document.querySelectorAll('div')) {
  console.log(element.textContent)
}
```

---

## 10. 破坏性变更与废弃

### 默认值变更

| 选项 | 旧默认值 | 新默认值 | 影响 |
|------|----------|----------|------|
| `strict` | `false` | `true` | 启用严格模式 |
| `module` | `commonjs` | `esnext` | 使用 ES 模块 |
| `target` | `es3` | `es2025` | 编译到最新 ES |
| `rootDir` | 自动推断 | `.` | 需要显式设置 |
| `types` | 自动包含所有 | `[]` | 需要显式声明 |
| `noUncheckedSideEffectImports` | `false` | `true` | 检查导入错误 |
| `libReplacement` | `true` | `false` | 提升性能 |

### 废弃的选项

| 选项 | 状态 | 替代方案 |
|------|------|----------|
| `target: es5` | 废弃 | 使用 `es2015` 或更高 |
| `--downlevelIteration` | 废弃 | 不再需要 |
| `--moduleResolution node` | 废弃 | 使用 `nodenext` 或 `bundler` |
| `--module amd/umd/systemjs` | 废弃 | 使用 ESM |
| `--baseUrl` | 废弃 | 直接使用 `paths` |
| `--moduleResolution classic` | 废弃 | 使用 `nodenext` 或 `bundler` |
| `--esModuleInterop: false` | 废弃 | 始终为 `true` |
| `--alwaysStrict: false` | 废弃 | 始终严格模式 |
| `--outFile` | 移除 | 使用打包工具 |
| `module` 关键字（命名空间） | 废弃 | 使用 `namespace` |
| `asserts` 关键字（导入） | 废弃 | 使用 `with` |
| `no-default-lib` 指令 | 废弃 | 使用 `--noLib` |

---

## 11. 迁移到 TypeScript 6.0

### 迁移步骤

```json
{
  "compilerOptions": {
    // 1. 设置 types
    "types": ["node", "jest"],

    // 2. 设置 rootDir
    "rootDir": "./src",

    // 3. 设置 module 和 moduleResolution
    "module": "esnext",
    "moduleResolution": "bundler",

    // 4. 设置 target
    "target": "es2020",

    // 5. 如果需要旧行为
    "strict": false,  // 如果依赖旧默认值
    "ignoreDeprecations": "6.0"  // 临时忽略废弃警告
  }
}
```

### 常见错误修复

```typescript
// 错误：Cannot find module '...'
// 修复：添加 types
{
  "compilerOptions": {
    "types": ["node"]
  }
}

// 错误：文件输出到错误目录
// 修复：显式设置 rootDir
{
  "compilerOptions": {
    "rootDir": "./src"
  }
}

// 错误：Import assertions have been replaced
// 修复：使用 with 代替 asserts
import blob from './data.json' with { type: 'json' }
```

### 使用 ts5to6 工具

```bash
npx ts5to6
```

该工具可以自动调整 `baseUrl` 和 `rootDir`。

---

## 小结

### 新特性亮点

| 特性 | 价值 |
|------|------|
| Temporal API | 未来日期时间处理标准 |
| getOrInsert | 简化 Map 操作 |
| RegExp.escape | 安全的正则构建 |
| es2025 | 支持最新 ES 特性 |

### 迁移重点

1. **设置 `types`**：`"types": ["node"]`
2. **设置 `rootDir`**：`"rootDir": "./src"`
3. **更新 `module`**：从 `commonjs` 改为 `esnext`
4. **更新 `moduleResolution`**：从 `node` 改为 `bundler` 或 `nodenext`
5. **处理废弃警告**：使用 `ignoreDeprecations: "6.0"` 临时跳过

### 为 TypeScript 7.0 做准备

TypeScript 6.0 是过渡版本，废弃的选项将在 7.0 中完全移除。建议现在就开始迁移。

---

## 参考链接

- [TypeScript 6.0 发布说明](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [ts5to6 迁移工具](https://github.com/andrewbranch/ts5to6)
- [Temporal API 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
