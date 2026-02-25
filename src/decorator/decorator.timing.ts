// @ts-nocheck

/**
 * 测量函数执行时间的装饰器
 */
function Timing(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value; // 保存原始函数

    descriptor.value = function (...args: any[]) {
        const startTime = performance.now(); // 记录开始时间
        const result = originalMethod.apply(this, args); // 执行原始函数
        const endTime = performance.now(); // 记录结束时间
        const duration = endTime - startTime; // 计算执行时间

        console.log(`[${propertyKey}] 执行时间：${duration.toFixed(4)} ms`);
        return result;
    };

    return descriptor;
}

class DataProcessor {
    @Timing
    processData(data: number[]): number[] {
        // 模拟耗时操作
        for (let i = 0; i < 1000000; i++) {
            // 空循环模拟计算
        }
        return data.map(x => x * 2);
    }

    @Timing
    async fetchData(url: string): Promise<string> {
        // 模拟异步操作
        await new Promise(resolve => setTimeout(resolve, 100));
        return `Data from ${url}`;
    }
}


// 测试装饰器
const processor = new DataProcessor();

console.log("=== 同步方法测试 ===");
const result = processor.processData([1, 2, 3, 4, 5]);
console.log("处理结果:", result);

console.log("\n=== 异步方法测试 ===");
processor.fetchData("https://api.example.com/data").then(data => {
    console.log("获取数据:", data);
});

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("=== 测试等待 ===");
    // await testWait();
}
