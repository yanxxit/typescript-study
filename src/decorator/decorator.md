# [decorator 装饰器](https://cloud.tencent.com/developer/article/2305532)

## 装饰器简介
在TypeScript中，装饰器是一种特殊类型的声明，可以被附加到**类声明，方法，属性，访问器或参数**上。装饰器的核心思想是增强已经存在的类、方法、属性等的行为，或者添加新的行为。通过装饰器，我们可以在不改变原始类的定义的情况下，为类添加新的特性。

在TypeScript中，装饰器使用`@expression`的形式。其中，expression必须为一个返回函数的表达式，这个函数在运行时会被调用，传入相关的装饰器参数。

TypeScript支持以下几种类型的装饰器：

- 类装饰器
- 方法装饰器
- 访问器装饰器
- 属性装饰器
- 参数装饰器

## 类装饰器
类装饰器应用于类的构造函数，用于观察、修改或替换类定义。类装饰器在应用时，会作为函数调用，并将构造函数作为其唯一的参数。

```ts
function Sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@Sealed
class Greeter {
    constructor(public greeting: string) {}
    greet() {
        return "Hello, " + this.greeting;
    }
}
```

## 方法装饰器
方法装饰器应用于方法的属性描述符，并可以用于观察、修改或替换方法定义。当装饰器被调用时，它会接收到三个参数：当前类的原型，方法名，以及该方法的属性描述符。

```ts
// @ts-nocheck
function Log(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value; // 保存原始函数
    descriptor.value = function (...args: any[]) {
        console.log("Arguments: ", JSON.stringify(args));
        let result = originalMethod.apply(this, args);

        console.log("Result: ", result);
        return result;
    }
}

class Calculator {
    @Log
    add(x: number, y: number): number {
        return x + y;
    }
}

// 测试装饰器
const calculator = new Calculator();
const result = calculator.add(5, 3);
console.log("Final result:", result);
```

## 访问器装饰器
访问器装饰器可以应用于访问器的属性描述符，并可以用于观察、修改或替换访问器的定义。访问器装饰器和方法装饰器有相似的语法。

```ts
function ReadOnly(target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
    return descriptor;
}

class Circle {
    private _radius: number;

    constructor(radius: number) {
        this._radius = radius;
    }

    @ReadOnly
    get radius() {
        return this._radius;
    }
}
```

## 装饰器与反射元数据
为了让装饰器能够更好地工作，TypeScript 提供了反射元数据 API。 这是一个实验性的 API，它允许装饰器在声明时添加元数据。 可以使用 npm 来安装反射元数据 API：

反射元数据（Reflect Metadata）是一个实验性的 API，用于在声明装饰器时执行元数据类型注解和元数据反射。

```sh
npm install reflect-metadata --save
```
然后，你需要在全局范围内导入反射 API:
```ts
import "reflect-metadata";
```