# @types

对于较新版本的express，您需要增强`express-serve-static-core`模块。

这是必需的，因为现在Express对象来自于那里：`https://github.com/DefinitelyTyped/DefinitelyTyped/blob/8fb0e959c2c7529b5fa4793a44b41b797ae671b9/types/express/index.d.ts#L19`

### 基本上，请使用以下内容：
```ts
declare module 'express-serve-static-core' {
  interface Request {
    myField?: string
  }
  interface Response {
    myField?: string
  }
}
```

1. *.d.ts 打开后才会有效果，未打卡时，无效果，这该怎么办

### declare 关键字
declare 是描述 TS 文件之外信息的一种机制，它的作用是告诉 TS 某个类型或变量已经存在，我们可以使用它声明全局变量、函数、类、接口、类型别名、类的属性或方法以及模块与命名空间。

在类型声明文件中，对于 type、interface 等只能在 TS 中使用的关键字，可以省略 declare 关键字；对于 let、function 等在 JS、TS 中都能用的关键字，应该使用 declare 关键字，明确指定此处用于类型声明
当使用第三方库的时候，我们需要引入它的声明文件，才能获得对应的代码补全，接口提示等功能
```ts
// 声明全局变量
declare var
 
// 声明全局方法
declare function
 
// 声明全局类
declare class
 
// 声明全局枚举类型
declare enum
 
// 声明（含有子属性的）全局对象
declare namespace
 
// 声明全局类型
interface 和 type
 
// 三斜线指令
/// <reference />
```


### .d.ts 文件：
1. .d.ts 是 declaration（类型声明文件）。
2. 只包含类型信息的类型声明文件，不能出现可执行代码。
3. 不会生成 .js 文件，仅用于提供类型信息。
4. 用途：为 JS 提供类型信息。

## 使用已有的类型声明文件
### 【TS 内置的类型声明文件】
TS 为 JS 运行时可用的所有标准化内置 API 都提供了声明文件。
比如，在使用数组时，数组所有方法都会有相应的代码提示以及类型信息。

### 【第三方库的类型声明文件】
目前，几乎所有常用的第三方库都有相应的类型声明文件。

第三方库的类型声明文件有两种存在形式：

1. 库自带类型声明文件：比如，axios。

2. 由 DefinitelyTyped 提供。https://github.com/DefinitelyTyped/DefinitelyTyped/

DefinitelyTyped 是一个 github 仓库，用来提供高质量 TypeScript 类型声明。

可以通过命令 `npm i -D @types/包名` 来下载该仓库提供的 TS 类型声明包。安装后，TS 也会自动加载该类声明包，以提供该库的类型声明。

### 创建类型声明文件
操作步骤：

- 创建 ***.d.ts 类型声明文件。
- 创建需要共享的类型，并使用 export 导出（TS 中的类型也可以使用 import/export 实现模块化功能）。
- 在需要使用共享类型的 .ts 文件中，通过 import 导入即可，导入时不加后缀 .ts（.d.ts 导入时，若路径下无同名 .ts 文件，后缀 .d 也可以省略（反例：demo.d.ts 和 demo.ts））

### 为已有 JS 文件提供类型声明
将 JS 项目迁移到 TS 项目时，为了让已有的 .js 文件有类型声明，可以根据已有 js 脚本编写 .ts 类型声明文件。


## 安装typings
```sh
npm install typings -g
```

### 初始化项目
1. 在项目下执行`typings init`项目下会自动生成文件`typings.json`这个文件给typings使用，类似于`package.json`
2. 检查是否有`jsconfig.json`文件，如果没有就新建一个，内容无要求

### 编写自己的智能提示
1. 在typings文件夹下创建对应的文件夹
2. 添加index.d.ts文件，在里面写各种提示的逻辑
3. 将文件路径添加到typings文件夹下的index.d.ts中，类似：
```ts
/// <reference path="globals/node/index.d.ts" />
```


### 编写提示代码
1. 使用declare来定义
2. 使用export来开放
3. 地址1 地址2
```ts
declare function domready (...): any;

export = domready
```

## 参考
- [使用类型记录扩展Express请求对象](https://cloud.tencent.com/developer/ask/sof/113263866)
- [巧妙利用TypeScript模块声明帮助你解决声明拓展](https://zhuanlan.zhihu.com/p/542379032) 