// @ts-nocheck

/**
 * 函数计时器 - 高阶函数实现
 * 
 * 注意：TypeScript 装饰器 @decorator 只能用于：
 * - 类 (class)
 * - 类方法 (method)
 * - 属性 (property)
 * - 访问器 (accessor)
 * - 参数 (parameter)
 * 
 * 普通函数不能使用 @ 语法，只能用高阶函数包装
 */
function Timing(fn: Function): Function {
    return function (...args: any[]) {
        const startTime = performance.now();
        const result = fn.apply(this, args);
        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`[${fn.name}] 执行时间：${duration.toFixed(4)} ms`);
        return result;
    };
}

// ============ 方式 1: 普通函数 - 使用高阶函数包装 ============
function calculateSum(numbers: number[]): number {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += numbers.reduce((a, b) => a + b, 0);
    }
    return sum;
}

// 包装函数
const timedCalculateSum = Timing(calculateSum);

// ============ 方式 2: 类方法 - 使用 @ 装饰器语法 ============
function MethodTiming(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const startTime = performance.now();
        const result = originalMethod.apply(this, args);
        const endTime = performance.now();
        console.log(`[${propertyKey}] 执行时间：${endTime - startTime.toFixed(4)} ms`);
        return result;
    };
    return descriptor;
}

class Calculator {
    @MethodTiming
    /**
     * 加法运算
     * @param x 第一个操作数
     * @param y 第二个操作数
     * @returns 两个操作数的和
     */
    add(x: number, y: number): number {
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result = x + y;
        }
        return result;
    }
}

// ============ 测试 ============
console.log("=== 普通函数 (高阶函数包装) ===");
timedCalculateSum([1, 2, 3, 4, 5]);

console.log("\n=== 类方法 (@装饰器语法) ===");
const calc = new Calculator();
calc.add(5, 3);
