# tsconfig.json 错误码

## 函数实现重复。ts(2393)
在 TypeScript 中，错误 `TS2393: Duplicate function implementation` 表示你在一个作用域内重复定义了同一个函数（即函数名相同且签名相同），而 TypeScript 不允许这样。

**解决方案：**

1. 重新定义函数名
2. 使用 class 来封装函数，将函数作为 class 的方法。（推荐）控制作用域



