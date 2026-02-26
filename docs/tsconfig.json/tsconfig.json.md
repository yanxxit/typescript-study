# tsconfig.json 相关配置

## 基本配置

```js
{
    "compilerOptions": {
        "outDir": "./built",// 输出目录
        "allowJs": true,// 接受JavaScript做为输入
        "target": "es5",// 编译目标
        "module": "commonjs",// 模块系统 commonjs 或者 module
        "emitDecoratorMetadata": true,// Enables experimental support for emitting type metadata for decorators.
        "experimentalDecorators": true,// Enables experimental support for ES7 decorators.
    },
    "include": [// 包含的文件
        "./src/**/*"
    ]
}
```

## 编译提示选项

- `noImplicitReturns` 会防止你忘记在函数末尾返回值。
- `noFallthroughCasesInSwitch` 会防止在switch代码块里的两个case之间忘记添加break语句。

- `noImplicitAny` 禁止隐式any类型


- `strictNullChecks` 严格空值检查
-