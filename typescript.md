# typescript

## 什么是 TypeScript？
TypeScript 是一种由微软开发的自由和开源的编程语言，它是JavaScript的一个超集，扩展了JavaScript的语法。

Typescript 可以在任何浏览器、任何计算机和任何操作系统上运行，并且是开源的。


**始于JavaScript，归于JavaScript**
TypeScript从今天数以百万计的JavaScript开发者所熟悉的语法和语义开始。使用现有的JavaScript代码，包括流行的JavaScript库，并从JavaScript代码中调用TypeScript代码。

TypeScript可以编译出纯净、 简洁的JavaScript代码，并且可以运行在任何浏览器上、Node.js环境中和任何支持ECMAScript 3（或更高版本）的JavaScript引擎中。


**强大的工具构建 大型应用程序**
类型允许JavaScript开发者在开发JavaScript应用程序时使用高效的开发工具和常用操作比如静态检查和代码重构。

类型是可选的，类型推断让一些类型的注释使你的代码的静态验证有很大的不同。类型让你定义软件组件之间的接口和洞察现有JavaScript库的行为。

**先进的 JavaScript**
TypeScript提供最新的和不断发展的JavaScript特性，包括那些来自2015年的ECMAScript和未来的提案中的特性，比如异步功能和Decorators，以帮助建立健壮的组件。

这些特性为高可信应用程序开发时是可用的，但是会被编译成简洁的ECMAScript3（或更新版本）的JavaScript。
**语法特性**

* 类 Classes
* 接口 Interfaces
* 模块 Modules
* 类型注解 Type annotations
* 编译时类型检查 Compile time type checking
* Arrow 函数 (类似 C# 的 Lambda 表达式)

### JavaScript 与 TypeScript 的区别
TypeScript 是 JavaScript 的超集，扩展了 JavaScript 的语法，因此现有的 JavaScript 代码可与 TypeScript 一起工作无需任何修改，TypeScript 通过类型注解提供编译时的静态类型检查。
TypeScript 可处理已有的 JavaScript 代码，并只对其中的 TypeScript 代码进行编译。

## TypeScript 的自我理解
* 一个js的超集
* 最终会编译成js进行执行的
* 通过ts环境，编写，然后实时编译
* ts 运行过程中如何监控代码异常

## 安装环境
```sh
npm install -g typescript
```

## 使用
安装完成后我们就可以使用 TypeScript 编译器，名称叫 tsc，可将编译结果生成 js 文件。
要编译 TypeScript 文件，可使用如下命令：

```sh
tsc filename.ts

tsc filename.ts -w
# typescript 构建模式
tsc -b
tsc -b src test

# 配置文件名为tsconfig.json
tsc -p
```

## 开发环境
* vscode tslint

## typescript 基本语法
### 类型批注
TypeScript 通过类型批注提供静态类型以在编译时启动类型检查。这是可选的，而且可以被忽略而使用 JavaScript 常规的动态类型。
```ts
function Add(left: number, right: number): number {
    return left + right;
}
```

* number
* boolean
* string
* any
* interface

对于基本类型的批注是`number`, `bool`和`string`。而弱或动态类型的结构则是`any类型`。
类型批注可以被导出到一个单独的声明文件以让使用类型的已被编译为JavaScript的TypeScript脚本的类型信息可用。批注可以为一个现有的JavaScript库声明，就像已经为Node.js和jQuery所做的那样。
当类型没有给出时，TypeScript编译器利用类型推断以推断类型。如果由于缺乏声明，没有类型可以被推断出，那么它就会默认为是动态的any类型。

### interface 接口
1. 与golang 有何区别
2. 其使用方法是什么？
3. interface 接口名称首字母大写，加上I前缀，表示接口
接下来，我们通过一个接口来扩展以上实例，创建一个 interface.ts 文件，修改 index.html 的 js 文件为 interface.js。
interface.js 文件代码如下:

```ts
interface IShape {
    name: string;//不可以省略
    width: number;
    height: number;
    color?: string;//表示可以省略
}

function area(shape : Shape) {
    var area = shape.width * shape.height;
    return "I'm " + shape.name + " with area " + area + " cm squared";
}

//有时候我们希望一个接口允许有任意的属性
interface IPerson {
  readonly id:number;//只读属性
  name: string;
  age?:number;
  [propName:string]:any;
}

let tom: IPerson ={
  id:1230,
  name:"Tom",
  gender:"male"
}
//使用 [propName: string] 定义了任意属性取 string 类型的值。
//需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：


console.log( area( {name: "rectangle", width: 30, height: 15} ) );
console.log( area( {name: "square", width: 30, height: 30, color: "blue"} ) );

```

接口可以作为一个类型批注。
编译以上代码 tsc interface.ts 不会出现错误，但是如果你在以上代码后面添加缺失 name 参数的语句则在编译时会报错：

### 箭头函数表达式（lambda表达式）
lambda表达式 `()=>{something}`或`()=>something` 相当于js中的函数,它的好处是可以自动将函数中的this附加到上下文中。
尝试执行以下：
```ts
var shape = {
    name: "rectangle",
    popup: function() {
        console.log('This inside popup(): ' + this.name);
        setTimeout(function() {
            console.log('This inside setTimeout(): ' + this.name);
            console.log("I'm a " + this.name + "!");
        }, 3000);
    }
};

shape.popup();

```
实例中的 this.name 是一个空值：

### class 类
TypeScript支持集成了可选的类型批注支持的ECMAScript 6的类。
接下来我们创建一个类文件 class.ts，代码如下：
```ts
class Shape {

    area: number;
    color: string;

    constructor ( name: string, width: number, height: number ) {
        this.area = width * height;
        this.color = "pink";
    };

    shoutout() {
        return "I'm " + this.color + " " + this.name +  " with an area of " + this.area + " cm squared.";
    }
}

var square = new Shape("square", 30, 30);

console.log( square.shoutout() );
console.log( 'Area of Shape: ' + square.area );
console.log( 'Name of Shape: ' + square.name );
console.log( 'Color of Shape: ' + square.color );
console.log( 'Width of Shape: ' + square.width );
console.log( 'Height of Shape: ' + square.height );

​```
以上 Shape 类中有两个属性 area 和 color，一个构造器 (constructor()), 一个方法是 shoutout() 。
构造器中参数(name, width 和 height) 的作用域是局部变量，所以编译以上文件，在浏览器输出错误结果如下所示：

```ts
class.ts(12,42): The property 'name' does not exist on value of type 'Shape'
class.ts(20,40): The property 'name' does not exist on value of type 'Shape'
class.ts(22,41): The property 'width' does not exist on value of type 'Shape'
class.ts(23,42): The property 'height' does not exist on value of type 'Shape'
```

### TypeScript中的类型断言[as语法 | ＜＞ 语法]
要理解好类型断言，其实就深刻理解一句话：你会比TypeScript更了解某个值的详细信息 。
类型断言，断言 断言，顾名思义，我断定怎么怎么样，代入这句话里就是，我断定这个类型是什么。当然这是我们主观上的思维逻辑，程序并不认可，所以我们需要告诉程序：“相信我，我知道自己在干什么” 。

```ts
const date = dealDate(dateFormatter('2020-7-28','/') as string);

// 或者这么用
const a = dealDate(<string>dateFormatter('2020-7-28', '/'));
```

## 参考
- [](https://github.com/Microsoft/TypeScript-Node-Starter)
- [](https://www.cnblogs.com/liqi-0126/p/11015196.html)
- 新颁布升级
