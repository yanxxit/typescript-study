# 类型

- null
- undefined
- void
- string
- number
- never 类型表示的是那些永不存在的值的类型
- any 任意
- Object
- enum
- bool


## 类型推论:返回的内容格式
TypeScript里，在有些没有明确指出类型的地方，类型推论会帮助提供类型

```js
let x = 3;
```
变量x的类型被推断为数字。 这种推断发生在初始化变量和成员，设置默认参数值和决定函数返回值时。

## type
```ts
type ActivityType = 'about' | 'java';
type TIntegralsAction = 'add' | 'subtract';
```
