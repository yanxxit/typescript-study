// logging.ts - 日志功能高阶函数

import winston from 'winston';
import type { AnyFunction, Logger, LoggingOptions } from './types.ts';

/**
 * 创建默认的 winston logger 实例
 */
export function createDefaultLogger(filename = 'logs/hof-combined.log'): winston.Logger {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}] ${message}`;
            })
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logs/hof-error.log', level: 'error' }),
            new winston.transports.File({ filename })
        ]
    });
}

/**
 * 默认 logger 实例
 */
export const defaultLogger: Logger = createDefaultLogger();

/**
 * 高阶函数：为任意函数添加日志
 * 
 * @param fn - 目标函数
 * @param options - 日志配置选项
 * @returns 包装后的函数
 * 
 * @example
 * ```typescript
 * const add = withLogging((a: number, b: number) => a + b);
 * add(2, 3);
 * 
 * // 禁用日志
 * const fastAdd = withLogging((a: number, b: number) => a + b, { enabled: false });
 * 
 * // 隐藏敏感数据
 * const login = withLogging(
 *     (user: string, pass: string) => authenticate(user, pass),
 *     { logArgs: false, logResult: false }
 * );
 * ```
 */
export function withLogging<T extends AnyFunction>(fn: T, options?: LoggingOptions): T {
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
                    const duration = performance.now() - startTime;
                    const resultStr = logResult ? JSON.stringify(res) : '[hidden]';
                    const durationStr = logDuration ? `, duration: ${duration.toFixed(2)}ms` : '';
                    log.info(`"${fnName}" resolved with result: ${resultStr}${durationStr}`);
                }
                return res;
            }).catch(err => {
                if (enabled) {
                    const duration = performance.now() - startTime;
                    const errStr = JSON.stringify(err);
                    const durationStr = logDuration ? `, duration: ${duration.toFixed(2)}ms` : '';
                    log.error(`"${fnName}" rejected with error: ${errStr}${durationStr}`);
                }
                throw err;
            }) as ReturnType<T>;
        } else {
            if (enabled) {
                const duration = performance.now() - startTime;
                const resultStr = logResult ? JSON.stringify(result) : '[hidden]';
                const durationStr = logDuration ? `, duration: ${duration.toFixed(2)}ms` : '';
                log.info(`"${fnName}" returned: ${resultStr}${durationStr}`);
            }
            return result;
        }
    } as T;
}

/**
 * 高阶函数：仅记录函数调用（不记录返回值和耗时）
 */
export function withCallLog<T extends AnyFunction>(fn: T, options?: Omit<LoggingOptions, 'logResult' | 'logDuration'>): T {
    return withLogging(fn, { ...options, logResult: false, logDuration: false });
}

/**
 * 高阶函数：仅记录错误日志
 */
export function withErrorLogging<T extends AnyFunction>(fn: T, options?: Omit<LoggingOptions, 'logArgs' | 'logResult' | 'logDuration'>): T {
    const { enabled = true, logger: customLogger } = options ?? {};
    const log = customLogger ?? defaultLogger;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
        const fnName = fn.name || 'anonymous';

        try {
            const result = fn.apply(this, args);

            if (result instanceof Promise) {
                return result.catch(err => {
                    if (enabled) {
                        log.error(`"${fnName}" rejected with error: ${JSON.stringify(err)}`);
                    }
                    throw err;
                }) as ReturnType<T>;
            }

            return result;
        } catch (err) {
            if (enabled) {
                log.error(`"${fnName}" threw error: ${JSON.stringify(err)}`);
            }
            throw err;
        }
    } as T;
}
