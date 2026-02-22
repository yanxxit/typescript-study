# typescript tsc

## 安装

```sh
npm install --save-dev typescript
```

## tsc

```sh
tsc interface.ts # 将ts文件转换为同文件夹的interface.js
# 如果配置了tsconfig.json 可以这几在tsconfig.json同级目录下执行tsc命令，类似gulp 命令
tsc --watch # 监视文件变化，自动编译
```

## tscconfig.json

- 不带任何输入文件的情况下调用tsc，编译器会从当前目录开始去查找`tsconfig.json`文件，逐级向上搜索父目录。
- 不带任何输入文件的情况下调用tsc，且使用命令行参数`--project`（或-p）指定一个包含`tsconfig.json`文件的目录。
- 当命令行上指定了输入文件时，`tsconfig.json`文件会被忽略。

```sh
tsc --init
```

- https://www.tslang.cn/docs/handbook/tsconfig-json.html
- https://www.cnblogs.com/gina/p/8960754.html

### 示例配置文件
```js
{
  "compilerOptions": {
    "module": "commonjs", //指定生成哪个模块系统代码
    "target": "es6", //目标代码类型
    "noImplicitAny": false, //在表达式和声明上有隐含的'any'类型时报错。
    "sourceMap": false, //用于debug
    "rootDir": "./src", //仅用来控制输出的目录结构--outDir。
    "outDir": "./dist", //重定向输出目录。
    "watch": true //在监视模式下运行编译器。会监视输出文件，在它们改变时重新编译。
  },
  "include": [
    "./src/*"
  ],
  "exclude": [
    "views",
    "static"
  ]
}
```

### 实例配置文件二

```js
{
  "compilerOptions": {
    "target": "es2015",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowJs": true,       // 允许编译 JavaScript 文件
    "checkJs": false,      // 初始阶段暂不检查 JS 文件类型，逐步开启
    "outDir": "./dist",    // 输出目录
    "rootDir": "./src"     // 源码目录
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```


## 配置项

- files 属性 ts文件 指定一个包含相对或绝对文件路径的列表

- include 包含
  - * 匹配0或多个字符（不包括目录分隔符）
  - ? 匹配一个任意字符（不包括目录分隔符）
  - **/ 递归匹配任意子目录

- exclude 排除

- compilerOptions
https://typescript.bootcss.com/compiler-options.html
- extends 继承配置
```js
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "strictNullChecks": false
  }
}
```

- compileOnSave
在最顶层设置compileOnSave标记，可以让IDE在保存文件的时候根据tsconfig.json重新生成文件。
```js
{
    "compileOnSave": true,
    "compilerOptions": {
        "noImplicitAny" : true
    }
}
```