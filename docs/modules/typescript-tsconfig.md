# TypeScript tsconfig.json 完全指南

> tsconfig.json 是 TypeScript 项目的配置文件，定义了编译选项、文件包含规则和项目结构。正确配置 tsconfig 是 TypeScript 项目成功的关键。

## 目录

1. [什么是 tsconfig.json](#1-什么是-tsconfigjson)
2. [基本结构](#2-基本结构)
3. [compilerOptions 核心选项](#3-compileroptions-核心选项)
4. [strict 严格模式选项](#4-strict-严格模式选项)
5. [模块相关选项](#5-模块相关选项)
6. [输出相关选项](#6-输出相关选项)
7. [文件包含与排除](#7-文件包含与排除)
8. [extends 继承](#8-extends-继承)
9. [项目引用（References）](#9-项目引用references)
10. [常见配置模板](#10-常见配置模板)
11. [最佳实践](#11-最佳实践)

---

## 1. 什么是 tsconfig.json

```typescript
// tsconfig.json 告诉 TypeScript 编译器：
// 1. 如何编译代码（compilerOptions）
// 2. 包含哪些文件（include/exclude）
// 3. 项目结构（references）
```

---

## 2. 基本结构

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"],
  "extends": "./tsconfig.base.json",
  "references": [
    { "path": "./packages/core" }
  ]
}
```

---

## 3. compilerOptions 核心选项

### target

指定编译后的 JavaScript 版本。

```json
{
  "compilerOptions": {
    "target": "es2020"
  }
}
```

| 值 | 说明 |
|----|------|
| `es3` | ES3（默认） |
| `es5` | ES5 |
| `es2015` | ES2015（ES6） |
| `es2017` | ES2017（async/await） |
| `es2020` | ES2020（可选链、空值合并） |
| `es2022` | ES2022（顶层 await） |
| `esnext` | 最新特性 |

### module

指定模块系统。

```json
{
  "compilerOptions": {
    "module": "commonjs"
  }
}
```

| 值 | 说明 |
|----|------|
| `commonjs` | Node.js 默认 |
| `es2015`/`es2020`/`esnext` | ES 模块 |
| `amd` | AMD（RequireJS） |
| `umd` | UMD |
| `none` | 不生成模块代码 |

### moduleResolution

模块解析策略。

```json
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}
```

| 值 | 说明 |
|----|------|
| `node` | Node.js 解析算法（最常用） |
| `bundler` | 现代打包工具（Vite, Webpack） |
| `classic` | TypeScript 1.6 之前（不推荐） |

---

## 4. strict 严格模式选项

### strict（总开关）

开启所有严格检查。

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 严格模式子选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `strictNullChecks` | 严格空值检查 | true |
| `strictFunctionTypes` | 严格函数类型检查 | true |
| `strictBindCallApply` | 严格 bind/call/apply 检查 | true |
| `strictPropertyInitialization` | 严格属性初始化检查 | true |
| `noImplicitAny` | 禁止隐式 any | true |
| `noImplicitThis` | 禁止隐式 this | true |
| `alwaysStrict` | 始终生成严格模式代码 | true |

### 常用严格选项

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

| 选项 | 说明 |
|------|------|
| `noImplicitReturns` | 禁止函数隐式返回 undefined |
| `noFallthroughCasesInSwitch` | 禁止 switch 穿透 |
| `noUnusedLocals` | 禁止未使用的局部变量 |
| `noUnusedParameters` | 禁止未使用的参数 |

---

## 5. 模块相关选项

```json
{
  "compilerOptions": {
    "module": "es2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@utils/*": ["src/utils/*"]
    },
    "typeRoots": ["./@types"],
    "types": ["node", "jest"]
  }
}
```

| 选项 | 说明 |
|------|------|
| `esModuleInterop` | 允许 CommonJS 和 ES 模块互操作 |
| `allowSyntheticDefaultImports` | 允许默认导入没有默认导出的模块 |
| `baseUrl` | 非相对模块名的基准目录 |
| `paths` | 路径映射 |
| `typeRoots` | 类型声明文件目录 |
| `types` | 包含的类型包 |

---

## 6. 输出相关选项

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "noEmit": false,
    "importHelpers": true
  }
}
```

| 选项 | 说明 |
|------|------|
| `outDir` | 输出目录 |
| `rootDir` | 源文件根目录 |
| `declaration` | 生成 .d.ts 声明文件 |
| `declarationMap` | 生成声明文件的 source map |
| `sourceMap` | 生成 source map |
| `removeComments` | 移除注释 |
| `noEmit` | 不生成输出文件 |
| `importHelpers` | 使用 tslib 辅助函数 |

---

## 7. 文件包含与排除

### include

指定包含的文件。

```json
{
  "include": ["src/**/*"]
}
```

支持 glob 模式：
- `*` - 匹配任意文件
- `**` - 匹配任意目录
- `?` - 匹配单个字符

### exclude

指定排除的文件。

```json
{
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

### files

指定包含的文件列表。

```json
{
  "files": ["src/index.ts", "src/global.d.ts"]
}
```

---

## 8. extends 继承

继承另一个 tsconfig 文件。

### 基本用法

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "strict": true,
    "esModuleInterop": true
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true
  }
}
```

### 继承规则

- `compilerOptions` 会合并（子覆盖父）
- `include`、`exclude`、`files` 会被覆盖（不合并）
- 可以继承多个配置文件

```json
{
  "extends": [
    "./tsconfig.base.json",
    "./tsconfig.react.json"
  ]
}
```

---

## 9. 项目引用（References）

用于大型项目的增量编译。

```json
// 根 tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./packages/app" }
  ]
}

// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist"
  }
}
```

| 选项 | 说明 |
|------|------|
| `composite` | 启用项目引用 |
| `declaration` | 必须为 true |
| `incremental` | 增量编译 |

---

## 10. 常见配置模板

### Node.js 后端

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### React/Vite 前端

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "lib": ["es2020", "dom", "dom.iterable"],
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### NestJS

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

### 严格模式

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

---

## 11. 最佳实践

### 1. 使用 strict: true

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 2. 使用 extends 复用配置

```json
// tsconfig.base.json - 共享配置
{
  "compilerOptions": {
    "target": "es2020",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

// tsconfig.json - 项目配置
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### 3. 使用 paths 简化导入

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

### 4. 排除不需要的文件

```json
{
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### 5. 使用 skipLibCheck 加速编译

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

---

## 速查表

| 选项 | 推荐值 | 说明 |
|------|--------|------|
| `target` | `es2020` | 编译目标 |
| `module` | `es2020` 或 `commonjs` | 模块系统 |
| `moduleResolution` | `node` 或 `bundler` | 模块解析 |
| `strict` | `true` | 严格模式 |
| `esModuleInterop` | `true` | ES/CJS 互操作 |
| `skipLibCheck` | `true` | 跳过库检查 |
| `outDir` | `./dist` | 输出目录 |
| `declaration` | `true` | 生成声明文件 |
| `sourceMap` | `true` | 生成 source map |
| `resolveJsonModule` | `true` | 允许导入 JSON |
