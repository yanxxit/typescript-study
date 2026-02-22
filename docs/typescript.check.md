# typescript 类型检查

> 阮一峰《TypeScript 教程》学习笔记——注释指令


## 1. 一段话总结

TypeScript 提供三类**核心注释指令**（`// @ts-nocheck`、`// @ts-check`、`// @ts-ignore`/`// @ts-expect-error`），用于控制编译器的类型检查范围（如跳过文件检查、强制 JS 文件检查、跳过单行检查）；同时支持 **JSDoc 注释**为代码补充类型信息，常用标签包括`@typedef`（自定义类型）、`@type`（定义变量类型）、`@param`（定义函数参数类型）、`@return`/`@returns`（定义返回值类型）、`@extends`（定义继承基类）及`@public`/`@protected`/`@private`/`@readonly`（控制成员访问性），JSDoc 需满足 “以`/**`开头”和 “与代码相邻” 的基本要求。

## 2. 思维导图

![](https://i-blog.csdnimg.cn/direct/868478d3ebb0488cab538acf2d84df4f.png)

## 3. 详细总结

### 一、TypeScript 注释指令

TypeScript 通过双斜杠注释形式提供 **3 类指令**，用于灵活控制编译器的类型检查行为，具体对比如下：

<table><thead><tr><th>注释指令</th><th>核心作用</th><th>适用脚本类型</th><th>效果示例</th></tr></thead><tbody><tr><td><strong><code>// @ts-nocheck</code></strong></td><td>告知编译器<strong>不检查当前脚本</strong>的类型错误</td><td>TypeScript、JavaScript</td><td>脚本内<code>document.getElementById(123)</code>（参数类型错误）不报错</td></tr><tr><td><strong><code>// @ts-check</code></strong></td><td>强制编译器<strong>检查当前 JavaScript 脚本</strong>（无视<code>checkJs</code>编译选项）</td><td>仅 JavaScript</td><td>JS 脚本内<code>console.log(isChceked)</code>（拼写错误）会报错</td></tr><tr><td><strong><code>// @ts-ignore</code></strong><br><strong><code>// @ts-expect-error</code></strong></td><td>告知编译器<strong>跳过下一行代码</strong>的类型检查</td><td>TypeScript、JavaScript</td><td>下一行<code>let x:number = false</code>（类型不匹配）不报错</td></tr></tbody></table>

### 二、JSDoc 注释

TypeScript 支持通过 JSDoc 注释为代码补充类型信息，尤其适用于 JavaScript 脚本（无需改写为 TS 即可获得类型检查），需满足 **2 个基本要求**，核心标签及用法如下：

#### 1. JSDoc 基本要求

*   **格式要求**：必须以`/**`开头（星号数量为 2，其他多行注释形式会被忽略）；
*   **位置要求**：注释与描述的代码必须相邻，且注释在代码上方。

#### 2. 核心 JSDoc 标签详解

<table><thead><tr><th>标签</th><th>核心作用</th><th>语法示例</th><th>关键说明</th></tr></thead><tbody><tr><td><strong><code>@typedef</code></strong></td><td>创建自定义类型（等同 TypeScript 的类型别名）</td><td>```/** @typedef {(number</td><td>string)} NumberLike */```</td></tr><tr><td><strong><code>@type</code></strong></td><td>定义变量的类型（支持 TS 所有类型语法）</td><td><code>/** @type {number[]} */ let arr;</code><br><code>/** @type {{ x: number, y?: string }} */ let obj;</code></td><td>可使用联合类型、数组、对象等 TS 类型语法</td></tr><tr><td><strong><code>@param</code></strong></td><td>定义函数参数的类型</td><td>1. 必选参数：<br><code>/** @param {string} x */ function foo(x) {}</code><br>2. 可选参数：<br><code>/** @param {string} [x] */ function foo(x) {}</code><br>3. 带默认值：<br><code>/** @param {string} [x="bar"] */ function foo(x) {}</code></td><td>可选参数需用<code>[]</code>包裹，默认值在<code>[]</code>内指定</td></tr><tr><td><strong><code>@return</code>/<code>@returns</code></strong></td><td>定义函数返回值的类型（两者作用完全相同）</td><td><code>/** @return {boolean} */ function foo() { return true; }</code><br><code>/** @returns {number} */ function bar() { return 0; }</code></td><td>无返回值可写<code>@return {void}</code></td></tr><tr><td><strong><code>@extends</code></strong></td><td>定义类的继承基类</td><td><code>/** @extends {Base} */ class Derived extends Base {}</code></td><td>需与类的<code>extends</code>关键字配合使用</td></tr><tr><td><strong>访问修饰符标签</strong></td><td>控制类成员的访问性与只读性</td><td>1. 访问性：<br><code>/** @public */ x = 0;</code><br><code>/** @protected */ y = 0;</code><br>2. 只读：<br><code>/** @public @readonly */ x = 0;</code></td><td><code>@public</code>/<code>@protected</code>/<code>@private</code>对应三类访问性，<code>@readonly</code>定义只读成员</td></tr></tbody></table>

## 4. 关键问题

### 问题 1：`// @ts-check` 注释指令与 `checkJs` 编译选项的核心区别是什么？在什么场景下需要使用 `// @ts-check`？

**答案**：  
核心区别在于**作用范围和优先级**：

*   `checkJs` 是 `tsconfig.json` 中的全局编译选项，开启后会对项目中所有 `.js` 文件进行类型检查；
*   `// @ts-check` 是脚本级注释指令，仅对**当前单个 `.js` 文件**强制开启类型检查，优先级高于 `checkJs`（即使 `checkJs` 关闭，该指令仍生效）。

适用场景：当项目中仅需对**部分 `.js` 文件**进行类型检查（而非全部）时，无需修改全局 `checkJs` 配置，只需在目标文件顶部添加 `// @ts-check` 即可，例如维护旧项目时，仅对新编写的 JS 文件开启类型检查。

### 问题 2：JSDoc 注释要生效，必须满足哪两个基本要求？若不满足这些要求，会导致什么结果？

**答案**：  
JSDoc 注释生效的两个基本要求是：

1.  **格式要求**：必须以 `/**` 开头（星号数量为 2），使用其他多行注释形式（如 `/*`、`/***`）会被 TypeScript 忽略；
2.  **位置要求**：注释必须与所描述的代码**相邻**，且注释在代码上方（中间不能插入其他代码或空行）。

若不满足要求，TypeScript 会无法识别 JSDoc 中的类型信息，导致：

*   变量 / 函数的类型无法被推断，可能被当作 `any` 类型；
*   类型错误（如参数类型不匹配）无法被编译器检测到，失去类型检查的作用。

示例：

```ts
// 不满足格式要求（仅1个星号），JSDoc无效
/* @type {string} */
let a = 123; // 不报错（TypeScript未识别类型）

// 不满足位置要求（中间有空行），JSDoc无效
/** @type {string} */

let b = 456; // 不报错（TypeScript未识别类型）

```

### 问题 3：`@param` 标签如何定义 “可选参数” 和“带默认值的可选参数”？请分别结合示例说明，并解释语法中的关键细节。

**答案**：  
`@param` 标签通过 **方括号 `[]`** 标识可选参数，默认值直接在 `[]` 内通过 `=` 指定，具体语法及示例如下：

1.  **定义可选参数**：
    
*   语法：`@param {类型} [参数名]`（将参数名包裹在 `[]` 内，表示该参数可选）；
*   示例：
        
```ts
/**
 * @param {string} [name] - 可选的用户名
 */
function greet(name) {
  console.log(name ? `Hello ${name}` : "Hello");
}
greet(); // 正确（可选参数可省略）
greet(123); // 报错（TypeScript识别参数类型应为string）

```
*   关键细节：`[]` 仅包裹参数名，类型仍写在 `{}` 内，明确可选参数的预期类型。
2.  **定义带默认值的可选参数**：
    
*   语法：`@param {类型} [参数名=默认值]`（在 `[]` 内通过 `=` 为参数指定默认值）；
*   示例：
```ts
/**
 * @param {string} [name="Guest"] - 带默认值的用户名
 */
function greet(name) {
  // 未传参时，name为默认值"Guest"
  name = name ?? "Guest"; 
  console.log(`Hello ${name}`);
}
greet(); // 输出"Hello Guest"（使用默认值）
        
```
*   关键细节：默认值需与参数类型兼容（如示例中默认值 "Guest" 为 string 类型，与参数类型一致），TypeScript 会检查传入值与默认值的类型一致性。
