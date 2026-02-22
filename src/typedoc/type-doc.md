# typedoc

以下是关于 **TypeDoc** 的全面解析，涵盖其核心功能、使用场景、配置方法及最佳实践，结合实际项目案例说明其应用价值：

## 命令行示例

```sh
typedoc src/typedoc --out docs/typedoc

# 输出实际生效的配置，排查隐藏的默认值。
typedoc --showConfig
```
---

### 一、TypeDoc 概述
**TypeDoc** 是专为 TypeScript 设计的网页生成工具，通过解析代码中的类型定义和注释，自动生成结构化 API 网页。其核心优势在于：
- **自动化**：与代码强绑定，网页与代码同步更新
- **类型感知**：直接利用 TypeScript 类型系统生成精确网页
- **扩展性**：支持插件、主题定制和 CI/CD 集成
- **多格式输出**：支持 HTML、Markdown、JSON 等格式

**适用场景**：
- 组件库/API 网页生成（如 Ant Design、Magic Resume）
- 开源项目文档自动化
- 团队内部代码规范与知识沉淀

---

### 二、安装与基础配置
#### 1. 安装方式
```bash
# 本地安装（推荐）
npm install --save-dev typedoc typedoc-plugin-markdown
pnpm add -D typedoc typedoc-plugin-markdown

# 全局安装（慎用，可能引发插件冲突）
npm install -g typedoc
```

#### 2. 配置文件（typedoc.json）
```json
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "name": "My Project API",
  "theme": "hierarchy",
  "excludePrivate": true,
  "excludeProtected": true,
  "includeVersion": true,
  "plugin": ["typedoc-plugin-markdown"],
  "customCss": "theme/custom.css"
}
```
**关键配置项**：
- `entryPoints`: 文档入口文件（支持 glob 模式）
- `theme`: 主题选择（默认/层级/Markdown 等）
- `excludePrivate`: 排除私有成员
- `includeVersion`: 显示包版本号
- `customCss`: 自定义样式

---

### 三、注释规范与网页生成
#### 1. JSDoc 注释示例
```typescript
/**
 * 用户信息接口定义
 * @interface User
 * @property {string} id - 用户唯一标识
 * @property {string} [name] - 用户姓名（可选）
 * @property {number} age - 用户年龄
 */
export interface User {
  id: string;
  name?: string;
  age: number;
}

/**
 * 获取用户信息
 * @param {string} userId - 用户ID
 * @returns {Promise<User>} 用户信息对象
 * @example
 * ```typescript
 * const user = await getUser('123');
 * console.log(user.name);
 * ```
 */
async function getUser(userId: string): Promise<User> {
  // 实现逻辑
}
```

#### 2. 注释标签支持
| 标签         | 说明                          | 示例                     |
|--------------|-------------------------------|--------------------------|
| `@param`     | 函数参数说明                  | `@param id {string}`     |
| `@returns`   | 返回值说明                    | `@returns {Promise}`     |
| `@example`   | 代码示例                      | 见上方示例               |
| `@typedef`   | 自定义类型定义                | 定义复杂类型结构         |
| `@category`  | 分类分组                      | 将接口/类归类展示        |

---

### 四、高级功能与最佳实践
#### 1. 插件生态系统
| 插件                  | 功能描述                          | 适用场景                     |
|-----------------------|-----------------------------------|------------------------------|
| `typedoc-plugin-markdown` | 生成 Markdown 格式网页           | GitHub Pages 托管          |
| `typedoc-plugin-merge-modules` | 合并模块网页减少层级          | 大型项目模块化网页管理     |
| `typedoc-theme-hierarchy` | 层级化主题（左侧导航+搜索栏）   | 企业级网页导航优化         |

**插件配置示例**：
```json
{
  "plugin": ["typedoc-plugin-markdown"],
  "out": "docs/markdown"
}
```

#### 2. 自动化部署流程
**GitHub Actions 配置**：
```yaml
name: Docs Deployment
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run docs:generate
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

#### 3. 多模块网页管理
**目录结构**：
```
src/
├── core/
│   └── index.ts
├── utils/
│   └── math.ts
└── components/
    └── button.tsx
```

**配置**：
```json
{
  "entryPoints": ["src/core/index.ts", "src/utils/math.ts"],
  "categorizeByGroup": true,
  "categoryOrder": ["Core", "Utils"]
}
```

---

### 五、主题定制与样式控制
#### 1. 默认主题优化
```css
/* theme/custom.css */
.navbar {
  background-color: #1890ff;
}

.page-title {
  color: #1890ff;
}

.member-type {
  font-weight: bold;
}
```

#### 2. 自定义主题开发
```typescript
import { Theme } from 'typedoc';
export class CustomTheme extends Theme {
  render(container: HTMLElement) {
    // 自定义渲染逻辑
  }
}
```

---

### 六、企业级应用案例
#### 案例：Ant Design X 组件库网页
**实现步骤**：
1. **注释规范**：为组件接口添加详细 JSDoc
2. **配置优化**：
   ```json
   {
     "entryPoints": ["components/index.ts"],
     "theme": "hierarchy",
     "excludeExternals": true,
     "plugin": ["typedoc-plugin-mermaid"]
   }
   ```
3. **自动化部署**：集成到 CI/CD 流程，发布到 Vercel/Netlify

**效果**：
- 类型安全：接口参数自动类型提示
- 交互式网页：支持代码高亮和在线编辑
- 版本管理：网页与代码版本同步

---

### 七、常见问题与解决方案
| 问题现象               | 解决方案                          |
|------------------------|-----------------------------------|
| 网页生成不完整         | 检查 `entryPoints` 配置是否包含所有入口文件 |
| 类型不显示             | 确保 `declaration: true` 在 tsconfig.json 中启用 |
| 注释不解析             | 检查是否符合 TSDoc 规范，避免使用不支持的标签 |
| 构建速度慢             | 启用缓存：`typedoc --cache`       |

---

### 八、性能优化建议
1. **增量生成**：仅重新生成变更文件的网页
2. **并行处理**：配置 `concurrency` 参数提升编译速度
3. **资源压缩**：使用 `terser` 插件压缩输出文件

---

### 九、扩展阅读
- https://typedoc.org/
- https://github.com/TypeStrong/typedoc
- 《TypeScript 网页工程化实践》（参考搜索结果）

通过合理运用 TypeDoc，开发者可显著提升网页维护效率，实现「代码即网页」的理想状态。建议结合 CI/CD 流程建立自动化网页更新机制，确保技术债可控。