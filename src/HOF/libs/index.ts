// index.ts - 高阶函数库统一导出
// Higher-Order Functions Library

/**
 * # 高阶函数库 (Higher-Order Functions Library)
 * 
 * 本库提供了一系列高阶函数，用于增强函数的功能：
 * 
 * - 📝 **日志功能** (`logging`): 自动记录函数调用、参数、返回值和执行时间
 * - ⏱️ **计时功能** (`timing`): 统计函数执行时间，支持性能分析
 * - 💾 **缓存功能** (`caching`): 缓存函数结果，支持 LRU 和 TTL 策略
 * - 🔄 **重试功能** (`retry`): 失败自动重试，支持指数退避
 * 
 * @example
 * ```typescript
 * import { withLogging, withCache, withRetry, withTiming } from './index';
 * 
 * // 组合使用多个高阶函数
 * const fetchData = withLogging(
 *     withCache(
 *         withRetry(fetch, { maxRetries: 3 }),
 *         { ttl: 5000 }
 *     )
 * );
 * 
 * // 或者使用管道组合
 * const enhancedFn = pipe(
 *     withLogging,
 *     withCache({ ttl: 5000 }),
 *     withRetry({ maxRetries: 3 })
 * )(originalFn);
 * ```
 * 
 * @packageDocumentation
 */

// ==================== 类型导出 ====================
export type {
    AnyFunction,
    ExecutionResult,
    CacheStrategy,
    CacheOptions,
    RetryOptions,
    LoggingOptions,
    Logger,
    TimingOptions
} from './types';

// ==================== 日志功能 ====================
export {
    withLogging,
    withCallLog,
    withErrorLogging,
    createDefaultLogger,
    defaultLogger
} from './logging';

// ==================== 计时功能 ====================
export {
    withTiming,
    withStats,
    withProfile,
    getProfileStats,
    resetProfileStats,
    type ProfileStats
} from './timing';

// ==================== 缓存功能 ====================
export {
    withCache,
    withCacheStats,
    createCacheable,
    getCacheStats,
    resetCacheStats,
    type CacheStats,
    LRUCache
} from './caching';

// ==================== 重试功能 ====================
export {
    withRetry,
    withRetryStats,
    withRetryResult,
    withCancellableRetry,
    getRetryStats,
    resetRetryStats,
    type RetryStats,
    type RetryResult,
    type CancellableRetry
} from './retry';

// ==================== 工具函数 ====================

/**
 * 函数组合（从右到左）
 * 
 * @example
 * ```typescript
 * const fn = compose(
 *     withLogging,
 *     withTiming,
 *     originalFn
 * );
 * ```
 */
export function compose<A extends any[], B, C>(
    fn1: (fn: (...args: A) => B) => (...args: A) => C,
    fn2: (...args: A) => B
): (...args: A) => C;

export function compose<A extends any[], B, C, D>(
    fn1: (fn: (...args: A) => B) => (...args: A) => C,
    fn2: (fn: (...args: A) => C) => (...args: A) => D,
    fn3: (...args: A) => B
): (...args: A) => D;

export function compose<A extends any[], B, C, D, E>(
    fn1: (fn: (...args: A) => B) => (...args: A) => C,
    fn2: (fn: (...args: A) => C) => (...args: A) => D,
    fn3: (fn: (...args: A) => D) => (...args: A) => E,
    fn4: (...args: A) => B
): (...args: A) => E;

export function compose(...fns: any[]): any {
    if (fns.length === 0) return (arg: any) => arg;
    if (fns.length === 1) return fns[0];

    return fns.reduceRight((prevFn, nextFn) => {
        // 检查是否是高阶函数（需要传入原函数）
        if (nextFn.length === 1 && typeof nextFn === 'function') {
            return (...args: any[]) => prevFn(nextFn(...args));
        }
        return nextFn(prevFn);
    });
}

/**
 * 函数组合（从左到右）- 用于组合已配置好的高阶函数
 *
 * @example
 * ```typescript
 * // 管道方式组合多个高阶函数
 * const enhancedFetch = pipe(
 *     withRetry({ maxRetries: 3 }),
 *     withCache({ ttl: 5000 }),
 *     withLogging
 * )(fetch);
 * ```
 */
export function pipe(...fns: any[]): any {
    if (fns.length === 0) return (arg: any) => arg;
    if (fns.length === 1) return fns[0];

    // 返回一个函数，该函数接受原函数并依次应用所有高阶函数
    return function (originalFn: AnyFunction) {
        return fns.reduce((composed, hof) => {
            return hof(composed);
        }, originalFn);
    };
}

/**
 * 创建高阶函数组合器
 * 
 * @example
 * ```typescript
 * // 创建预配置的组合器
 * const withEnhancedLogging = createHOFComposer([
 *     withLogging,
 *     withTiming
 * ]);
 * 
 * const fn = withEnhancedLogging(originalFn);
 * ```
 */
export function createHOFComposer(hofs: Array<(fn: AnyFunction) => AnyFunction>) {
    return function composeHOF<T extends AnyFunction>(fn: T): T {
        return hofs.reduceRight((composed, hof) => hof(composed as AnyFunction) as T, fn);
    };
}
