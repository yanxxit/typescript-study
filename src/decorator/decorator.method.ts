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