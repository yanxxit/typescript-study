// demo.ts - 高阶函数库使用示例

import {
    withLogging,
    withTiming,
    withCache,
    withRetry,
    withStats,
    withProfile,
    getProfileStats,
    withCacheStats,
    getCacheStats,
    withRetryResult,
    createDefaultLogger,
    compose,
    pipe,
    createHOFComposer
} from './index';

// ==================== 1. 日志功能示例 ====================
console.log('\n========================================');
console.log('1. 日志功能示例 (withLogging)');
console.log('========================================\n');

// 基本日志
const add = withLogging((a: number, b: number): number => a + b);
console.log('>>> 测试：基本日志');
add(2, 3);

// 隐藏敏感数据
const login = withLogging(
    (user: string, pass: string) => ({ token: 'secret-token-123', userId: 1 }),
    { logArgs: false, logResult: false }
);
console.log('\n>>> 测试：隐藏敏感数据');
login('admin', 'password123');

// 禁用日志
const fastAdd = withLogging((a: number, b: number) => a + b, { enabled: false });
console.log('\n>>> 测试：禁用日志（无输出）');
fastAdd(10, 20);

// ==================== 2. 计时功能示例 ====================
console.log('\n========================================');
console.log('2. 计时功能示例 (withTiming)');
console.log('========================================\n');

// 基本计时
const slowCompute = withTiming((n: number) => {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += i;
    return sum;
});
console.log('>>> 测试：基本计时');
slowCompute(1000000);

// 带阈值的计时
const apiSimulator = withTiming(
    () => {
        const start = performance.now();
        while (performance.now() - start < 100) { } // 模拟 100ms 延迟
        return 'done';
    },
    { warnThreshold: 50, errorThreshold: 200 }
);
console.log('\n>>> 测试：阈值警告（>50ms 警告）');
apiSimulator();

// 返回统计信息
const multiply = withStats((a: number, b: number) => a * b);
console.log('\n>>> 测试：返回统计信息');
const result = multiply(6, 7);
console.log(`结果：${result.result}, 耗时：${result.duration.toFixed(2)}ms, 成功：${result.success}`);

// ==================== 3. 缓存功能示例 ====================
console.log('\n========================================');
console.log('3. 缓存功能示例 (withCache)');
console.log('========================================\n');

// 基本缓存
let callCount = 0;
const expensiveCalc = withCache((n: number) => {
    callCount++;
    let result = 0;
    for (let i = 0; i < n * 100000; i++) result += i;
    return result;
});

console.log('>>> 测试：缓存命中');
console.log('第一次调用:', expensiveCalc(100));
console.log('第二次调用（缓存）:', expensiveCalc(100));
console.log(`实际计算次数：${callCount}`);

// TTL 缓存
const fetchWithTTL = withCache(
    (key: string) => ({ data: `fresh-${Date.now()}`, key }),
    { ttl: 2000 } // 2 秒过期
);
console.log('\n>>> 测试：TTL 缓存');
console.log('第一次:', fetchWithTTL('user:1'));
console.log('第二次（缓存）:', fetchWithTTL('user:1'));

// 缓存统计
const countedCalc = withCacheStats(function countedCalc(n: number) { return n * 2; });
console.log('\n>>> 测试：缓存统计');
countedCalc(5);
countedCalc(5);
countedCalc(10);
const stats = getCacheStats('countedCalc');
console.log(`缓存统计：命中=${stats?.hits}, 未命中=${stats?.misses}, 命中率=${((stats?.hitRate || 0) * 100).toFixed(1)}%`);

// ==================== 4. 重试功能示例 ====================
console.log('\n========================================');
console.log('4. 重试功能示例 (withRetry)');
console.log('========================================\n');

// 模拟失败函数
let failCount = 0;
const flakyFn = withRetry(
    () => {
        failCount++;
        if (failCount < 3) throw new Error(`临时错误 #${failCount}`);
        return '成功!';
    },
    { maxRetries: 3, delay: 100, backoff: 1 }
);

// 重试结果（不抛错）
let alwaysFailCount = 0;
const failFn = withRetryResult(
    () => {
        alwaysFailCount++;
        throw new Error('总是失败');
    },
    { maxRetries: 2, delay: 50 }
);

console.log('\n>>> 测试：重试结果（不抛错）');
failFn().then(result => {
    console.log(`成功：${result.success}, 尝试次数：${result.attempts}, 错误：${result.error}`);
});

// ==================== 5. 性能分析示例 ====================
console.log('\n========================================');
console.log('5. 性能分析示例 (withProfile)');
console.log('========================================\n');

const profiledFn = withProfile(function profiledFn(n: number) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += i;
    return sum;
});

console.log('>>> 测试：多次调用统计');
profiledFn(500000);
profiledFn(1000000);
profiledFn(1500000);

const profileStats = getProfileStats('profiledFn');
console.log(`性能统计:`, profileStats);

// ==================== 6. 组合使用示例 ====================
console.log('\n========================================');
console.log('6. 组合使用示例');
console.log('========================================\n');

// 方式 1: 嵌套组合
const enhancedFn1 = withLogging(
    withCache(
        withTiming((n: number) => {
            if (n < 0) throw new Error('负数错误');
            return n * 2;
        }),
        { ttl: 5000 }
    )
);

console.log('>>> 测试：嵌套组合 (Logging + Cache + Timing)');
enhancedFn1(10);
enhancedFn1(10); // 缓存命中

// 方式 2: 使用嵌套组合（更可靠）
const enhancedFn2 = withLogging(
    withCache(
        withRetry(function divideFn(n: number) {
            if (n === 0) throw new Error('除零错误');
            return 100 / n;
        }, { maxRetries: 2, delay: 50 }),
        { ttl: 3000 }
    )
);

console.log('\n>>> 测试：Pipe 组合 (Retry + Cache + Logging)');
enhancedFn2(5);
enhancedFn2(5); // 缓存命中

// 方式 3: 创建预配置组合器
const withEnhancedLogging = createHOFComposer([
    withLogging,
    withTiming
]);

const enhancedFn3 = withEnhancedLogging((x: number) => x * x);
console.log('\n>>> 测试：预配置组合器');
enhancedFn3(9);

// ==================== 7. 异步函数示例 ====================
console.log('\n========================================');
console.log('7. 异步函数示例');
console.log('========================================\n');

const asyncFetch = withLogging(
    withRetry(
        async (url: string) => {
            // 模拟异步操作
            await new Promise(resolve => setTimeout(resolve, 50));
            return { url, status: 200, data: 'mock data' };
        },
        { maxRetries: 3 }
    )
);

console.log('>>> 测试：异步函数 (Logging + Retry)');
asyncFetch('https://api.example.com/data').then(console.log);

// ==================== 完成提示 ====================
setTimeout(() => {
    console.log('\n========================================');
    console.log('✅ 所有示例执行完成!');
    console.log('========================================\n');
}, 500);
