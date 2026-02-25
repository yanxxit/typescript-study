// retry.ts - 重试功能高阶函数

import type { AnyFunction, RetryOptions } from './types.ts';

/**
 * 延迟函数（兼容浏览器和 Node.js）
 */
async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 高阶函数：为任意函数添加重试功能
 * 
 * @param fn - 目标函数
 * @param options - 重试配置选项
 * @returns 包装后的函数
 * 
 * @example
 * ```typescript
 * // 基本重试（最多 3 次）
 * const fetchWithRetry = withRetry(fetchData);
 * 
 * // 自定义重试配置
 * const apiCall = withRetry(fetchData, {
 *     maxRetries: 5,
 *     delay: 1000,
 *     backoff: 2  // 指数退避
 * });
 * 
 * // 仅对特定错误重试
 * const networkCall = withRetry(fetchData, {
 *     retryOn: (err) => err instanceof NetworkError
 * });
 * 
 * // 重试回调
 * const resilientFn = withRetry(fn, {
 *     onRetry: (attempt, err) => {
 *         console.log(`第${attempt}次重试，错误：${err.message}`);
 *     }
 * });
 * ```
 */
export function withRetry<T extends AnyFunction>(fn: T, options?: RetryOptions): T {
    const {
        maxRetries = 3,
        delay: baseDelay = 1000,
        backoff = 2,
        retryOn,
        onRetry
    } = options ?? {};

    return async function (this: ThisParameterType<T>, ...args: Parameters<T>): Promise<ReturnType<T>> {
        let lastError: unknown;
        let attempt = 0;

        while (attempt <= maxRetries) {
            try {
                // 同步函数也需要用 Promise 包装以统一处理
                const result = await fn.apply(this, args);
                return result;
            } catch (error) {
                lastError = error;
                attempt++;

                // 检查是否应该重试
                if (retryOn && !retryOn(error)) {
                    throw error;
                }

                // 超过最大重试次数
                if (attempt > maxRetries) {
                    break;
                }

                // 调用重试回调
                if (onRetry) {
                    onRetry(attempt, error);
                }

                // 计算延迟时间（指数退避）
                const delayTime = baseDelay * Math.pow(backoff, attempt - 1);
                await delay(delayTime);
            }
        }

        throw lastError;
    } as unknown as T;
}

/**
 * 重试统计信息
 */
export interface RetryStats {
    /** 总调用次数 */
    totalCalls: number;
    /** 成功次数 */
    successCount: number;
    /** 失败次数 */
    failureCount: number;
    /** 重试次数 */
    retryCount: number;
    /** 成功率 */
    successRate: number;
}

const retryStatsMap = new Map<string, RetryStats>();

/**
 * 获取重试统计
 */
export function getRetryStats(fnName: string): RetryStats | undefined {
    return retryStatsMap.get(fnName);
}

/**
 * 重置重试统计
 */
export function resetRetryStats(fnName?: string): void {
    if (fnName) {
        retryStatsMap.delete(fnName);
    } else {
        retryStatsMap.clear();
    }
}

/**
 * 高阶函数：带统计信息的重试
 */
export function withRetryStats<T extends AnyFunction>(fn: T, options?: RetryOptions): T {
    const {
        maxRetries = 3,
        delay: baseDelay = 1000,
        backoff = 2,
        retryOn,
        onRetry
    } = options ?? {};

    const stats: RetryStats = {
        totalCalls: 0,
        successCount: 0,
        failureCount: 0,
        retryCount: 0,
        successRate: 0
    };

    const fnName = fn.name || 'anonymous';
    retryStatsMap.set(fnName, stats);

    return async function (this: ThisParameterType<T>, ...args: Parameters<T>): Promise<ReturnType<T>> {
        stats.totalCalls++;
        let lastError: unknown;
        let attempt = 0;

        while (attempt <= maxRetries) {
            try {
                const result = await fn.apply(this, args);
                stats.successCount++;
                stats.successRate = stats.successCount / stats.totalCalls;
                return result;
            } catch (error) {
                lastError = error;
                attempt++;

                if (retryOn && !retryOn(error)) {
                    stats.failureCount++;
                    stats.successRate = stats.successCount / stats.totalCalls;
                    throw error;
                }

                if (attempt > maxRetries) {
                    stats.failureCount++;
                    stats.successRate = stats.successCount / stats.totalCalls;
                    break;
                }

                stats.retryCount++;

                if (onRetry) {
                    onRetry(attempt, error);
                }

                const delayTime = baseDelay * Math.pow(backoff, attempt - 1);
                await delay(delayTime);
            }
        }

        stats.failureCount++;
        stats.successRate = stats.successCount / stats.totalCalls;
        throw lastError;
    } as unknown as T;
}

/**
 * 重试结果
 */
export interface RetryResult<T> {
    /** 是否成功 */
    success: boolean;
    /** 结果或错误 */
    data?: T;
    error?: unknown;
    /** 尝试次数 */
    attempts: number;
}

/**
 * 高阶函数：返回重试结果而不抛出错误
 * 
 * @example
 * ```typescript
 * const safeFetch = withRetryResult(fetchData);
 * const result = await safeFetch('https://api.example.com/data');
 * 
 * if (result.success) {
 *     console.log('数据:', result.data);
 * } else {
 *     console.log('失败，尝试了', result.attempts, '次');
 * }
 * ```
 */
export function withRetryResult<T extends AnyFunction>(fn: T, options?: RetryOptions): 
    (...args: Parameters<T>) => Promise<RetryResult<ReturnType<T>>> {
    const {
        maxRetries = 3,
        delay: baseDelay = 1000,
        backoff = 2,
        retryOn,
        onRetry
    } = options ?? {};

    return async function (this: ThisParameterType<T>, ...args: Parameters<T>): Promise<RetryResult<ReturnType<T>>> {
        let lastError: unknown;
        let attempt = 0;

        while (attempt <= maxRetries) {
            try {
                const result = await fn.apply(this, args);
                return {
                    success: true,
                    data: result,
                    attempts: attempt + 1
                };
            } catch (error) {
                lastError = error;
                attempt++;

                if (retryOn && !retryOn(error)) {
                    return {
                        success: false,
                        error,
                        attempts: attempt
                    };
                }

                if (attempt > maxRetries) {
                    break;
                }

                if (onRetry) {
                    onRetry(attempt, error);
                }

                const delayTime = baseDelay * Math.pow(backoff, attempt - 1);
                await delay(delayTime);
            }
        }

        return {
            success: false,
            error: lastError,
            attempts: attempt
        };
    };
}

/**
 * 可中断的重试操作
 */
export interface CancellableRetry {
    /** 取消重试 */
    cancel: () => void;
    /** 是否已取消 */
    isCancelled: () => boolean;
    /** 等待完成 */
    promise: Promise<ReturnType<AnyFunction>>;
}

/**
 * 高阶函数：支持取消的重试
 */
export function withCancellableRetry<T extends AnyFunction>(fn: T, options?: RetryOptions): 
    (...args: Parameters<T>) => CancellableRetry {
    const baseRetry = withRetry(fn, options);

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): CancellableRetry {
        let cancelled = false;

        const promise = (async () => {
            while (!cancelled) {
                try {
                    return await fn.apply(this, args);
                } catch {
                    if (cancelled) break;
                    // 简单重试，实际使用应传入完整 options
                    await delay(1000);
                }
            }
            throw new Error('Retry cancelled');
        })();

        return {
            cancel: () => { cancelled = true; },
            isCancelled: () => cancelled,
            promise
        };
    };
}
