function Sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
@Sealed
// @ts-ignore
class Greeter {
    constructor(public greeting: string) { }
    greet() {
        return "Hello, " + this.greeting;
    }
}

// 创建 Greeter 实例并调用 greet 方法
// @ts-ignore
const greeter = new Greeter("TypeScript");
console.log(greeter.greet()); // 输出: Hello, TypeScript
