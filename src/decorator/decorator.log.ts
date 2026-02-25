// @ts-nocheck

/**
 * 日志记录装饰器
 * 记录函数的入参、出参和执行时间
 */
function Log(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const startTime = performance.now();

        // 记录入参
        console.log(`\n[调用] ${propertyKey}`);
        console.log(`  入参：`, JSON.stringify(args));

        // 执行原始函数
        const result = originalMethod.apply(this, args);

        // 记录出参和执行时间
        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`  出参：`, JSON.stringify(result));
        console.log(`  耗时：${duration.toFixed(4)} ms`);

        return result;
    };

    return descriptor;
}

// ============ 异步方法日志装饰器 ============
function LogAsync(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        const startTime = performance.now();

        console.log(`\n[调用] ${propertyKey}`);
        console.log(`  入参：`, JSON.stringify(args));

        // 执行原始异步函数
        const result = await originalMethod.apply(this, args);

        // 记录出参和执行时间
        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`  出参：`, JSON.stringify(result));
        console.log(`  耗时：${duration.toFixed(4)} ms`);

        return result;
    };

    return descriptor;
}

// ============ 测试类 ============
class UserService {
    
    @Log
    getUserById(id: number): object {
        // 模拟数据处理
        for (let i = 0; i < 100000; i++) { }
        return { id, name: `User${id}`, email: `user${id}@example.com` };
    }

    @Log
    calculateTotal(prices: number[], tax: number): number {
        const subtotal = prices.reduce((sum, price) => sum + price, 0);
        return subtotal * (1 + tax);
    }

    @LogAsync
    async fetchUserData(userId: number): Promise<object> {
        // 模拟网络请求
        await new Promise(resolve => setTimeout(resolve, 50));
        return {
            userId,
            profile: { name: `User${userId}` },
            orders: [1, 2, 3]
        };
    }

    @Log
    processData(data: { name: string; value: number }): { success: boolean; processed: string } {
        // 模拟复杂处理
        for (let i = 0; i < 500000; i++) { }
        return {
            success: true,
            processed: `Processed: ${data.name} = ${data.value * 2}`
        };
    }
}

// ============ 运行测试 ============
const service = new UserService();

console.log("=== 测试 1: 获取用户信息 ===");
service.getUserById(123);

console.log("\n=== 测试 2: 计算总价 ===");
const total = service.calculateTotal([100, 200, 300], 0.1);
console.log(`最终结果：${total}`);

console.log("\n=== 测试 3: 异步获取数据 ===");
service.fetchUserData(456).then(data => {
    console.log("异步回调完成:", data);
});

console.log("\n=== 测试 4: 处理对象参数 ===");
service.processData({ name: "test", value: 42 });
