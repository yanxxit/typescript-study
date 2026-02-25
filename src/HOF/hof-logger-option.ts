// hof-logger.ts
import winston from 'winston';

type AnyFunction = (...args: any[]) => any;

/**
 * withLogging 配置选项
 */
interface WithLoggingOptions {
    /** 是否启用日志，默认 true */
    enabled?: boolean;
    /** 是否记录函数调用参数，默认 true */
    logArgs?: boolean;
    /** 是否记录函数返回值，默认 true */
    logResult?: boolean;
    /** 是否记录执行时间，默认 true */
    logDuration?: boolean;
    /** 自定义 logger 实例，默认使用内置 logger */
    logger?: winston.Logger;
}

/**
 * 创建专用的 logger 实例
 */
const defaultLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [
        // 输出到控制台
        new winston.transports.Console(),
        // 输出到文件
        new winston.transports.File({ filename: 'logs/hof-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/hof-combined.log' })
    ]
});

/**
 * 高阶函数：为任意函数添加日志和执行时间记录
 * @param fn - 目标函数
 * @param options - 配置选项
 */
function withLogging<T extends AnyFunction>(fn: T, options?: WithLoggingOptions): T {
    const {
        enabled = true,
        logArgs = true,
        logResult = true,
        logDuration = true,
        logger: customLogger
    } = options ?? {};

    const log = customLogger ?? defaultLogger;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
        const fnName = fn.name || 'anonymous';
        const startTime = performance.now();

        if (enabled) {
            const argsStr = logArgs ? JSON.stringify(args) : '[hidden]';
            log.info(`Calling "${fnName}" with args: ${argsStr}`);
        }

        const result = fn.apply(this, args);

        if (result instanceof Promise) {
            return result.then(res => {
                if (enabled) {
                    const duration = logDuration ? performance.now() - startTime : 0;
                    const resultStr = logResult ? JSON.stringify(res) : '[hidden]';
                    const durationStr = logDuration ? `, duration: ${duration.toFixed(2)}ms` : '';
                    log.info(`"${fnName}" resolved with result: ${resultStr}${durationStr}`);
                }
                return res;
            }).catch(err => {
                if (enabled) {
                    const duration = logDuration ? performance.now() - startTime : 0;
                    const errStr = JSON.stringify(err);
                    const durationStr = logDuration ? `, duration: ${duration.toFixed(2)}ms` : '';
                    log.error(`"${fnName}" rejected with error: ${errStr}${durationStr}`);
                }
                throw err;
            }) as ReturnType<T>;
        } else {
            if (enabled) {
                const duration = logDuration ? performance.now() - startTime : 0;
                const resultStr = logResult ? JSON.stringify(result) : '[hidden]';
                const durationStr = logDuration ? `, duration: ${duration.toFixed(2)}ms` : '';
                log.info(`"${fnName}" returned: ${resultStr}${durationStr}`);
            }
            return result;
        }
    } as T;
}

// ==================== 使用示例 ====================

// 1. 默认用法（启用所有日志）
const add = withLogging((a: number, b: number): number => a + b);

// 2. 禁用日志（性能敏感场景）
const fastAdd = withLogging((a: number, b: number): number => a + b, { enabled: false });

// 3. 隐藏参数和返回值（敏感数据）
const login = withLogging(
    (user: string, pass: string) => ({ token: 'xxx' }),
    { logArgs: false, logResult: false }
);

// 4. 只记录执行时间
const compute = withLogging(
    (n: number) => {
        let sum = 0;
        for (let i = 0; i < n; i++) sum += i;
        return sum;
    },
    { logArgs: false, logResult: false, logDuration: true }
);

// 5. 异步函数
const fetchData = withLogging(async (url: string) => {
    const res = await fetch(url);
    return res.status;
});

// ==================== 调用测试 ====================

console.log('\n--- 测试 1: 默认日志 ---');
add(2, 3);

console.log('\n--- 测试 2: 禁用日志 ---');
fastAdd(2, 3);

console.log('\n--- 测试 3: 隐藏敏感数据 ---');
login('admin', 'secret123');

console.log('\n--- 测试 4: 只记录耗时 ---');
compute(1000000);

// 异步测试（取消注释以运行）
// console.log('\n--- 测试 5: 异步函数 ---');
// fetchData('https://api-dev.tingo66.com/ping');

export { withLogging, defaultLogger };
export type { WithLoggingOptions };
