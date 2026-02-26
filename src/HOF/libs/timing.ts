// timing.ts - 执行时间统计高阶函数

import type { AnyFunction, ExecutionResult, Logger, TimingOptions } from './types.ts';
import { defaultLogger } from './logging';

/**
 * 时间单位转换
 */
function convertTime(ms: number, unit: 'ms' | 's' | 'us'): number {
    switch (unit) {
        case 'ms': return ms;
        case 's': return ms / 1000;
        case 'us': return ms * 1000;
    }
}

/**
 * 时间单位符号
 */
function getTimeUnitSymbol(unit: 'ms' | 's' | 'us'): string {
    switch (unit) {
        case 'ms': return 'ms';
        case 's': return 's';
        case 'us': return 'μs';
    }
}

/**
 * 高阶函数：为任意函数添加执行时间统计
 * 
 * @param fn - 目标函数
 * @param options - 计时配置选项
 * @returns 包装后的函数
 * 
 * @example
 * ```typescript
 * // 基本用法
 * const slowFn = withTiming((n: number) => {
 *     let sum = 0;
 *     for (let i = 0; i < n; i++) sum += i;
 *     return sum;
 * });
 * slowFn(1000000);
 * 
 * // 设置阈值警告
 * const apiCall = withTiming(fetchData, {
 *     warnThreshold: 1000,  // 超过 1 秒警告
 *     errorThreshold: 5000  // 超过 5 秒错误
 * });
 * 
 * // 使用秒为单位
 * const longTask = withTiming(doWork, { unit: 's' });
 * ```
 */
export function withTiming<T extends AnyFunction>(fn: T, options?: TimingOptions): T {
    const {
        enabled = true,
        unit = 'ms',
        logger: customLogger,
        warnThreshold,
        errorThreshold
    } = options ?? {};

    const log = customLogger ?? defaultLogger;
    const unitSymbol = getTimeUnitSymbol(unit);

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
        if (!enabled) {
            return fn.apply(this, args);
        }

        const fnName = fn.name || 'anonymous';
        const startTime = performance.now();
        const result = fn.apply(this, args);

        if (result instanceof Promise) {
            return result.then(res => {
                const duration = convertTime(performance.now() - startTime, unit);
                log.info(`"${fnName}" completed in ${duration.toFixed(2)}${unitSymbol}`);

                // 检查阈值
                if (warnThreshold && duration > warnThreshold && !errorThreshold) {
                    log.warn(`"${fnName}" exceeded warn threshold (${warnThreshold}${unitSymbol})`);
                }
                if (errorThreshold && duration > errorThreshold) {
                    log.error(`"${fnName}" exceeded error threshold (${errorThreshold}${unitSymbol})`);
                } else if (warnThreshold && duration > warnThreshold) {
                    log.warn(`"${fnName}" exceeded warn threshold (${warnThreshold}${unitSymbol})`);
                }

                return res;
            }).catch(err => {
                const duration = convertTime(performance.now() - startTime, unit);
                log.error(`"${fnName}" failed after ${duration.toFixed(2)}${unitSymbol}: ${JSON.stringify(err)}`);
                throw err;
            }) as ReturnType<T>;
        } else {
            const duration = convertTime(performance.now() - startTime, unit);
            log.info(`"${fnName}" completed in ${duration.toFixed(2)}${unitSymbol}`);

            // 检查阈值
            if (warnThreshold && duration > warnThreshold && !errorThreshold) {
                log.warn(`"${fnName}" exceeded warn threshold (${warnThreshold}${unitSymbol})`);
            }
            if (errorThreshold && duration > errorThreshold) {
                log.error(`"${fnName}" exceeded error threshold (${errorThreshold}${unitSymbol})`);
            } else if (warnThreshold && duration > warnThreshold) {
                log.warn(`"${fnName}" exceeded warn threshold (${warnThreshold}${unitSymbol})`);
            }

            return result;
        }
    } as T;
}

/**
 * 高阶函数：返回执行时间和结果的包装对象
 * 
 * @param fn - 目标函数
 * @returns 包装后的函数，返回 ExecutionResult
 * 
 * @example
 * ```typescript
 * const addWithStats = withStats((a: number, b: number) => a + b);
 * const { result, duration, success } = addWithStats(2, 3);
 * console.log(`结果：${result}, 耗时：${duration}ms`);
 * ```
 */
export function withStats<T extends AnyFunction>(fn: T): (...args: Parameters<T>) => ExecutionResult<ReturnType<T>> {
    return function (this: ThisParameterType<T>, ...args: Parameters<T>): ExecutionResult<ReturnType<T>> {
        const startTime = performance.now();

        try {
            const result = fn.apply(this, args);
            const duration = performance.now() - startTime;

            return {
                result,
                duration,
                success: true
            };
        } catch (error) {
            const duration = performance.now() - startTime;

            return {
                result: undefined as ReturnType<T>,
                duration,
                success: false,
                error
            };
        }
    };
}

/**
 * 高阶函数：性能分析，记录多次调用的统计信息
 */
export interface ProfileStats {
    /** 调用次数 */
    callCount: number;
    /** 总耗时 (ms) */
    totalTime: number;
    /** 平均耗时 (ms) */
    avgTime: number;
    /** 最小耗时 (ms) */
    minTime: number;
    /** 最大耗时 (ms) */
    maxTime: number;
}

const profileStatsMap = new Map<string, ProfileStats>();

/**
 * 获取函数的性能统计
 */
export function getProfileStats(fnName: string): ProfileStats | undefined {
    return profileStatsMap.get(fnName);
}

/**
 * 重置性能统计
 */
export function resetProfileStats(fnName?: string): void {
    if (fnName) {
        profileStatsMap.delete(fnName);
    } else {
        profileStatsMap.clear();
    }
}

/**
 * 高阶函数：性能分析
 *
 * @param fn - 目标函数
 * @param options - 计时配置选项
 * @returns 包装后的函数
 *
 * @example
 * ```typescript
 * const fn = withProfile(slowFunction);
 * fn(1000);
 * fn(2000);
 * fn(3000);
 *
 * const stats = getProfileStats('slowFunction');
 * console.log(stats); // { callCount: 3, avgTime: ..., minTime: ..., maxTime: ... }
 * ```
 */
export function withProfile<T extends AnyFunction>(fn: T, options?: TimingOptions): T {
    const {
        enabled = true,
        logger: customLogger
    } = options ?? {};

    const log = customLogger ?? defaultLogger;
    const fnName = fn.name || `fn_${Date.now()}`;

    const profiledFn = function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
        if (!enabled) {
            return fn.apply(this, args);
        }

        const startTime = performance.now();
        const result = fn.apply(this, args);

        if (result instanceof Promise) {
            return result.then(res => {
                const duration = performance.now() - startTime;
                updateStats(fnName, duration);
                return res;
            }).catch(err => {
                const duration = performance.now() - startTime;
                updateStats(fnName, duration);
                throw err;
            }) as ReturnType<T>;
        } else {
            const duration = performance.now() - startTime;
            updateStats(fnName, duration);
            return result;
        }
    } as T;

    // 保留原函数名
    Object.defineProperty(profiledFn, 'name', { value: fnName });

    return profiledFn;
}

/**
 * 更新性能统计
 */
function updateStats(fnName: string, duration: number): void {
    let stats = profileStatsMap.get(fnName);

    if (!stats) {
        stats = {
            callCount: 0,
            totalTime: 0,
            avgTime: 0,
            minTime: Infinity,
            maxTime: 0
        };
        profileStatsMap.set(fnName, stats);
    }

    stats.callCount++;
    stats.totalTime += duration;
    stats.avgTime = stats.totalTime / stats.callCount;
    stats.minTime = Math.min(stats.minTime, duration);
    stats.maxTime = Math.max(stats.maxTime, duration);
}
