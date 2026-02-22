# ts-node
> 直接执行ts文件

## install

```sh
npm install -g ts-node
```

## Usage

```sh
# Execute a script as `node` + `tsc`.
ts-node script.ts

# Starts a TypeScript REPL.
ts-node

# Execute code with TypeScript.
ts-node -e 'console.log("Hello, world!")'

# Execute, and print, code with TypeScript.
ts-node -p -e '"Hello, world!"'

# Pipe scripts to execute with TypeScript.
echo "console.log('Hello, world!')" | ts-node
```

## 可替代

### ts-node-dev

### deno

### bun

### ts-node-esm

## ts-node-esm vs ts-node vs ts-node-dev vs deno vs bunjs 全方位对比

。你对当前主流的 TypeScript 运行工具和环境感兴趣，希望从多个维度进行深入了解。下面我将从核心特性、性能、适用场景等方面，为你梳理 `ts-node`、`ts-node-esm`、`ts-node-dev`、`Deno` 和 `Bun` 的特点。

为了让你快速建立整体印象，我先用一个表格总结它们的核心差异。

| 特性维度 | ts-node | ts-node-esm | ts-node-dev | Deno | Bun |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **核心定位** | Node.js 的 TypeScript 执行工具 | 支持 ESM 的 ts-node | 带文件监听的 ts-node | **安全的现代运行时** | **全能的超快运行时/工具链** |
| **模块系统** | 默认 CJS，ESM 需配置 | **原生 ESM 支持** | 同 ts-node，ESM 支持需配置 | **纯 ESM** | **混合支持 (ESM/CJS)** |
| **TypeScript 支持** | JIT 编译 (TS Compiler) | JIT 编译 (TS Compiler) | JIT 编译 (TS Compiler) | **原生支持** (无需配置) | **原生支持** (集成转换器) |
| **文件监听/热重载** | 需配合 nodemon 等 | 需配合 nodemon 等 | **内置文件监听** | 内置 `--watch` 标志 | **内置热重载 (`--hot`)** |
| **默认安全性** | Node.js 环境权限 | Node.js 环境权限 | Node.js 环境权限 | **默认沙箱，需显式授权** | 类 Node.js，无严格限制 |
| **性能特点** | 开发友好，JIT 编译 | 同 ts-node | 同 ts-node，监听有开销 | 启动较快，架构现代 | **极致性能** (启动/执行) |
| **包管理** | 使用 npm | 使用 npm | 使用 npm | **URL 导入，或无包管理** | **内置极速包管理器** |
| **Node.js 兼容性** | **完全兼容** | **完全兼容** | **完全兼容** | 需兼容模式 | **高度兼容** |

### 💡 各工具详解与适用场景

这个表格展示了宏观的区别，接下来我们深入看看每个工具的细节和最适合的使用场景。

#### **1. ts-node 家族 (ts-node, ts-node-esm, ts-node-dev)**

这一系列工具的核心思路是在 Node.js 之上，提供直接运行 TypeScript 的能力。

-   **`ts-node`**: 它的工作原理是“劫持”了 Node.js 的模块加载器，在遇到 `.ts` 文件时，实时在内存中将其编译成 JavaScript 再执行，省去了先执行 `tsc` 编译的步骤。这使得它在**开发阶段特别高效**。需要注意的是，在大型项目中，可以通过开启 `transpileOnly: true` 选项来跳过类型检查，从而大幅提升启动速度。
-   **`ts-node-esm`**: 它本质上是 `ts-node` 的一个特殊模式或别名，用于更便捷地启用对 ESM 模块规范的支持。随着现代前端生态越来越倾向于 ESM，这个工具在开发 ES 模块项目时很有用。
-   **`ts-node-dev`**: 它在 `ts-node` 的基础上增加了文件监听功能。当文件改变时，它能自动重启应用，类似于 `nodemon`，但更专用于 TypeScript。这为开发提供了极大的便利。

> **主要场景**：**开发和调试现有的 Node.js 项目**。如果你的项目基于 Node.js 生态，并且依赖大量的 npm 包，这一系列工具是自然且安全的选择。

#### **2. Deno：安全至上的现代运行时**

Deno 由 Node.js 的创始人打造，旨在解决 Node.js 早期设计中的一些遗憾。它不仅仅是一个 TypeScript 运行器，而是一个完整的替代运行时。

-   **安全性是核心**：Deno 默认在沙箱中运行脚本，除非显式通过命令行参数（如 `--allow-net`、`--allow-read`）授权，否则无法访问网络、文件系统等。这对于运行不受信任的代码或构建插件系统非常有用。
-   **拥抱现代标准**：它原生支持 TypeScript 和 ESM，使用 URL 导入模块，摒弃了 `node_modules` 和复杂的包管理概念（尽管新版本也增加了对 npm 包的支持）。
-   **内置工具链**：提供了测试、格式化、打包等内置工具，减少了项目对第三方工具的依赖。

> **主要场景**：**新建项目，尤其看重安全性、希望拥抱最新 Web 标准、并深度使用 TypeScript**。例如，边缘计算函数、安全的脚本工具等。

#### **3. Bun：以性能为核心的全能工具链**

Bun 是一个新兴的竞争者，其最大特点是极致的性能，它使用 Zig 语言编写并采用 JavaScriptCore 引擎（Safari 浏览器所用）。

-   **卓越性能**：在多项基准测试中，无论是启动速度（毫秒级）还是 HTTP 请求吞吐量，Bun 都显著领先于 Node.js 和 Deno。
-   **一体化工具链**：它不仅仅是一个运行时，还内置了极快的包管理器（可替代 npm/yarn/pnpm）、打包器（可替代 Webpack）和测试运行器（可替代 Jest）。这意味着你可以用 Bun 这一款工具完成从安装依赖、运行开发服务器到构建打包的全流程。
-   **出色的开发体验**：内置了智能的热重载功能（`--hot`），可以保持应用状态的同时更新代码。同时对 Node.js 和 npm 生态系统有很高的兼容性，迁移成本低。

> **主要场景**：**追求极致性能的全栈项目、需要简化工具链的项目、以及作为替代现有 Node.js 工具链（如 npm, jest, webpack）的加速方案**。

### 💎 如何选择

你可以根据项目的核心需求，参考以下路径来做出选择：

| 你的需求 | 推荐选择 | 关键理由 |
| :--- | :--- | :--- |
| **维护或开发基于 Node.js 的传统项目** | **`ts-node` 或 `ts-node-dev`** | 生态成熟，完全兼容，风险最低。 |
| **开发使用 ESM 模块规范的新 Node.js 项目** | **`ts-node-esm`** | 为 ESM 项目提供了更顺畅的体验。 |
| **启动新项目，极度看重启动性能/执行速度** | **`Bun`** | 极快的启动速度和执行性能，一体化工具链提升开发效率。 |
| **启动新项目，安全是首要考虑（如插件系统）** | **`Deno`** | 默认的沙箱安全模型提供了强大的安全保障。 |
| **寻求简化技术栈，用一个工具管理依赖、构建、测试和运行** | **`Bun`** | 内置的包管理器、打包器、测试运行器可替代多个独立工具。 |
| **拥抱最前沿的 Web 标准，希望摆脱 node_modules** | **`Deno`** | 原生支持 ESM 和 URL 导入，设计理念更现代。 |

希望这份详细的对比能帮助你做出明智的技术选型。如果你能分享一些关于你项目具体场景的信息（比如是新项目还是现有项目，对性能和安全的具体要求等），我可以提供更精准的建议。

## 在实际项目中，从 ts-node 迁移到 Bun 的具体步骤和注意事项有哪些？
原生模块（Native Addons）：某些依赖包（特别是包含 C++ 代码的）可能需要针对 Bun 的 JavaScriptCore 引擎重新编译，而不能直接使用为 Node.js (V8) 预编译的版本 。
如果遇到原生模块报错，你需要检查该模块是否官方支持 Bun，或者尝试重新安装（如 bun add <package>）看是否能触发源码编译。

## 其他
- https://segmentfault.com/a/1190000012213680
- https://github.com/TypeStrong/ts-node
- https://segmentfault.com/a/1190000012213680