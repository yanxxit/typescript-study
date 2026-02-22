# typescript tsc + tsconfig.json 配置文件 是否可以实现将src目录的ts编码转换成dist，并生成*.d.ts文件

## 对应的项目

极光APISDK：自定义项目
```sh
git clone https://github.com/yanxxit/jmessage-rest-sdk.git
```

## 实践

是的，TypeScript 编译器 (`tsc`) 配合 `tsconfig.json` 配置文件完全可以实现将 `src` 目录下的 TypeScript 代码编译到 `dist` 目录，并生成相应的 `*.d.ts` 类型声明文件。这实际上是 TypeScript 项目非常标准的构建流程。

实现这一目标的核心在于正确配置 `tsconfig.json` 文件。下面是一个可以实现你需求的配置示例及其关键配置项的解释。

### 关键配置项说明

在你的 `tsconfig.json` 文件中，你需要关注 `compilerOptions` 下的这几个配置：

| 配置项 | 建议值 | 作用说明 |
| :--- | :--- | :--- |
| **`"outDir"`** | `"./dist"` | 指定编译后的文件（如 `.js` 和 `.d.ts`）的输出目录。 |
| **`"rootDir"`** | `"./src"` | 指定源代码（`.ts` 文件）的根目录。编译器会自动据此维护 `dist` 目录下的结构。 |
| **`"declaration"`** | `true` | **关键设置**。设为 `true` 时，编译器会为每个 `.ts` 文件生成一个对应的 `.d.ts` 声明文件。 |
| `"target"` | `"es2015"` 或 `"es5"` 等 | 指定编译生成的 JavaScript 代码的目标版本。 |
| `"module"` | `"commonjs"` 或 `"es2015"` 等 | 指定生成代码的模块系统规范。 |
| `"include"` | `["src/**/*"]` | 指明需要编译的文件范围，这里表示 `src` 目录下的所有文件。 |

### 操作步骤

1.  **创建配置文件**：在你的项目根目录下创建或检查 `tsconfig.json` 文件。你可以通过命令行 `tsc --init` 快速生成一个包含大量注释的初始配置文件，然后在此基础上修改。
2.  **应用配置**：将上面表格中的关键配置整合到你的 `tsconfig.json` 中。一个基本的配置示例如下：
    ```json
    {
      "compilerOptions": {
        "target": "es2015",
        "module": "commonjs",
        "outDir": "./dist",
        "rootDir": "./src",
        "declaration": true,
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
      },
      "include": [
        "src/**/*"
      ],
      "exclude": [
        "node_modules",
        "dist"
      ]
    }
    ```

3.  **执行编译**：在终端中，于项目根目录下运行 `tsc` 命令。编译器会自动读取 `tsconfig.json` 中的配置，并开始编译过程。
4.  **查看结果**：编译完成后，你会发现在项目根目录下生成了一个 `dist` 文件夹。其内部结构会与 `src` 目录保持一致，其中包含了编译后的 `.js` 文件以及你所需要的 `.d.ts` 类型声明文件。

### 补充说明

-   确保你的 `src` 目录结构清晰，并且 `rootDir` 的设置能够正确覆盖所有需要编译的源代码。如果 `rootDir` 设置不当，可能导致 `dist` 目录结构不符合预期。
-   `"declaration"` 选项**不能**与 `"allowJs"` 选项同时设置为 `true`。如果你的项目中有 JavaScript 文件需要编译，请注意这一点。
-   对于更复杂的项目，你还可以配置 `paths` 用于路径别名映射，这能简化代码中的导入路径。

总而言之，通过配置 `tsconfig.json` 并使用 `tsc` 命令，你可以轻松实现将 `src` 目录的 TypeScript 代码转换到 `dist` 目录并生成 `*.d.ts` 文件的需求。这是 TypeScript 工具链提供的标准且可靠的功能。
