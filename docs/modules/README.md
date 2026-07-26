# TypeScript 学习文档总目录

> 本目录整理了 TypeScript 核心特性的完整学习文档，涵盖类型系统、函数、类、模块、装饰器等所有核心知识点。每个主题都提供 Markdown 和 HTML 两种格式，HTML 版本带有丰富的可视化效果。

## 🚀 快速开始

如果你是 TypeScript 新手，建议从这里开始：

| 文档 | MD | HTML | 说明 |
|------|-----|------|------|
| 日常开发快速入门 | [typescript-quick-start.md](typescript-quick-start.md) | [typescript-quick-start.html](typescript-quick-start.html) | 聚焦日常开发最常用的特性，5 分钟上手 |

---

## 文档列表

### 核心类型系统

| 文档 | MD | HTML | 说明 |
|------|-----|------|------|
| 全部类型 | [typescript-all-types.md](typescript-all-types.md) | [typescript-all-types.html](typescript-all-types.html) | 原始类型、特殊类型、对象类型、数组等完整类型体系 |
| 内置工具类型 | [typescript-builtin-types.md](typescript-builtin-types.md) | [typescript-builtin-types.html](typescript-builtin-types.html) | Partial、Required、Pick、Omit 等内置工具类型 |
| Utility Types | [typescript-utility-types.md](typescript-utility-types.md) | [typescript-utility-types.html](typescript-utility-types.html) | 工具类型深入解析，含原理和实现 |
| 类型守卫 | [typescript-type-guards.md](typescript-type-guards.md) | [typescript-type-guards.html](typescript-type-guards.html) | typeof、instanceof、in、自定义类型守卫 |
| 类型断言与推断 | [typescript-assertions-inference.md](typescript-assertions-inference.md) | [typescript-assertions-inference.html](typescript-assertions-inference.html) | as 断言、as const、infer 关键字 |

### 类型定义

| 文档 | MD | HTML | 说明 |
|------|-----|------|------|
| Interface 接口 | [typescript-interface.md](typescript-interface.md) | [typescript-interface.html](typescript-interface.html) | 接口定义、继承、声明合并 |
| Type 类型别名 | [typescript-type.md](typescript-type.md) | [typescript-type.html](typescript-type.html) | 联合类型、交叉类型、映射类型 |
| 枚举 Enum | [typescript-enum.md](typescript-enum.md) | [typescript-enum.html](typescript-enum.html) | 数字枚举、字符串枚举、const 枚举 |

### 类型操作

| 文档 | MD | HTML | 说明 |
|------|-----|------|------|
| 泛型 | [typescript-generics.md](typescript-generics.md) | [typescript-generics.html](typescript-generics.html) | 泛型函数、泛型类、泛型约束 |
| 条件类型 | [typescript-conditional-types.md](typescript-conditional-types.md) | [typescript-conditional-types.html](typescript-conditional-types.html) | T extends U ? X : Y、infer 关键字 |
| 映射类型 | [typescript-mapped-types.md](typescript-mapped-types.md) | [typescript-mapped-types.html](typescript-mapped-types.html) | [K in keyof T]、键重映射 |
| 模板字面量类型 | [typescript-template-literal-types.md](typescript-template-literal-types.md) | [typescript-template-literal-types.html](typescript-template-literal-types.html) | 编译时字符串操作 |
| 类型推断 | [typescript-type-inference.md](typescript-type-inference.md) | [typescript-type-inference.html](typescript-type-inference.html) | 编译器自动推导类型、infer、上下文推断 |

### 函数与异步

| 文档 | MD | HTML | 说明 |
|------|-----|------|------|
| 函数 | [typescript-functions.md](typescript-functions.md) | [typescript-functions.html](typescript-functions.html) | 函数类型、重载、高阶函数 |
| async/await 与 Promise | [typescript-async-await-promise.md](typescript-async-await-promise.md) | [typescript-async-await-promise.html](typescript-async-await-promise.html) | Promise、async/await、错误处理 |

### 面向对象

| 文档 | MD | HTML | 说明 |
|------|-----|------|------|
| 类 | [typescript-classes.md](typescript-classes.md) | [typescript-classes.html](typescript-classes.html) | 访问修饰符、继承、抽象类、接口实现 |
| 装饰器 | [typescript-decorators.md](typescript-decorators.md) | [typescript-decorators.html](typescript-decorators.html) | 类装饰器、方法装饰器、装饰器工厂 |
| 装饰器新旧对比 | [typescript-decorators-comparison.md](typescript-decorators-comparison.md) | [typescript-decorators-comparison.html](typescript-decorators-comparison.html) | Legacy vs Standard 装饰器对比 |

### 项目配置与模块

| 文档 | MD | HTML | 说明 |
|------|-----|------|------|
| tsconfig 配置 | [typescript-tsconfig.md](typescript-tsconfig.md) | [typescript-tsconfig.html](typescript-tsconfig.html) | compilerOptions、strict 模块、项目引用 |
| 模块与命名空间 | [typescript-modules-namespaces.md](typescript-modules-namespaces.md) | [typescript-modules-namespaces.html](typescript-modules-namespaces.html) | ES 模块、CommonJS、命名空间 |
| 声明文件 | [typescript-declaration-files.md](typescript-declaration-files.md) | [typescript-declaration-files.html](typescript-declaration-files.html) | .d.ts 文件、模块声明、全局声明 |
| 错误处理 | [typescript-error-handling.md](typescript-error-handling.md) | [typescript-error-handling.html](typescript-error-handling.html) | try/catch、自定义错误、Result 模式 |

### 第三方库

| 文档 | MD | HTML | 说明 |
|------|-----|------|------|
| type-fest | [type-fest.md](type-fest.md) | [type-fest.html](type-fest.html) | 第三方实用类型库，补充内置类型 |
| reflect-metadata | [reflect-metadata.md](reflect-metadata.md) | [reflect-metadata.html](reflect-metadata.html) | 反射元数据 API |

### 面试准备

| 文档 | MD | HTML | 说明 |
|------|-----|------|------|
| 面试常见考点 | [typescript-interview-qa.md](typescript-interview-qa.md) | [typescript-interview-qa.html](typescript-interview-qa.html) | 30 个常见面试问题及最佳答案 |
| 80/20 法则 | [typescript-80-20-rule.md](typescript-80-20-rule.md) | [typescript-80-20-rule.html](typescript-80-20-rule.html) | 日常开发核心 20% 特性 |

### 新特性

| 文档 | MD | HTML | 说明 |
|------|-----|------|------|
| TypeScript 6.0 新特性 | [typescript-6-new-features.md](typescript-6-new-features.md) | [typescript-6-new-features.html](typescript-6-new-features.html) | TS 6.0 新特性、破坏性变更、迁移指南 |

---

## 学习路线建议

### 入门阶段

1. 全部类型 → 了解 TypeScript 类型体系
2. Interface 接口 → 定义对象结构
3. Type 类型别名 → 联合类型、交叉类型
4. 函数 → 函数类型和参数

### 进阶阶段

5. 泛型 → 创建可复用的类型安全代码
6. 类型守卫 → 运行时类型检查
7. 类型断言与推断 → as 断言、infer
8. 类型推断 → 编译器自动推导类型
9. 类 → 面向对象编程
10. 枚举 → 命名常量

> 💡 **新手建议**：如果是 TypeScript 新手，建议先阅读「日常开发快速入门」

### 高级阶段

10. 条件类型 → 类型层面的条件判断
11. 映射类型 → 遍历键创建新类型
12. 模板字面量类型 → 编译时字符串操作
13. 装饰器 → 元编程
14. 模块与命名空间 → 代码组织
15. 声明文件 → 类型声明
16. 错误处理 → 健壮的错误处理
17. tsconfig 配置 → 项目配置

### 扩展学习

18. 内置工具类型 → Partial、Pick、Omit 等
19. Utility Types → 工具类型深入解析
20. type-fest → 第三方实用类型
21. reflect-metadata → 反射元数据
22. 装饰器新旧对比 → Legacy vs Standard
23. TypeScript 6.0 新特性 → 最新版本特性

### 面试准备

24. 面试常见考点 → 30 个问题及最佳答案
25. 80/20 法则 → 日常开发核心特性

---

## 统计信息

| 类别 | 文档数量 | 总大小 |
|------|----------|--------|
| Markdown 文档 | 30 个 | ~350 KB |
| HTML 文档 | 30 个 | ~1.5 MB |
| **总计** | **60 个文件** | **~1.5 MB** |

---

## 如何使用

### Markdown 文档

适合在 GitHub、VS Code 等环境中阅读。

### HTML 文档

在浏览器中打开即可查看，支持：
- 暗色主题
- 语法高亮
- Mermaid 图表
- 响应式布局
- 滚动动画

```bash
# 在 macOS 上用浏览器打开
open index.html

# 在 Linux 上用浏览器打开
xdg-open index.html
```
