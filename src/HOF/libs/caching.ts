// caching.ts - 缓存功能高阶函数

import type { AnyFunction, CacheOptions } from './types';

/**
 * 缓存条目
 */
interface CacheEntry<T> {
    value: T;
    /** 创建时间戳 */
    timestamp: number;
}

/**
 * LRU 缓存实现
 */
class LRUCache<T> {
    private cache = new Map<string, CacheEntry<T>>();
    private maxSize: number;

    constructor(maxSize: number = 100) {
        this.maxSize = maxSize;
    }

    get(key: string): T | undefined {
        const entry = this.cache.get(key);
        if (!entry) return undefined;

        // LRU: 访问后移到末尾
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry.value;
    }

    set(key: string, value: T): void {
        // 如果已存在，先删除
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // 删除最旧的条目
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, { value, timestamp: Date.now() });
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    clear(): void {
        this.cache.clear();
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    get size(): number {
        return this.cache.size;
    }
}

/**
 * 默认缓存键生成器（JSON 序列化参数）
 */
function defaultKeyGenerator(...args: any[]): string {
    try {
        return JSON.stringify(args);
    } catch {
        // 如果参数不可序列化，使用引用
        return args.map(arg => String(arg)).join('|');
    }
}

/**
 * 高阶函数：为任意函数添加缓存功能
 * 
 * @param fn - 目标函数
 * @param options - 缓存配置选项
 * @returns 包装后的函数
 * 
 * @example
 * ```typescript
 * // 基本缓存
 * const expensiveCalc = withCache((n: number) => {
 *     let result = 0;
 *     for (let i = 0; i < n * 1000000; i++) result += i;
 *     return result;
 * });
 * 
 * // TTL 缓存（5 秒过期）
 * const fetchData = withCache(async (url: string) => {
 *     return fetch(url).then(r => r.json());
 * }, { ttl: 5000 });
 * 
 * // LRU 缓存（最多 50 条）
 * const compute = withCache(complexFn, {
 *     strategy: 'lru',
 *     maxSize: 50
 * });
 * ```
 */
export function withCache<T extends AnyFunction>(fn: T, options?: CacheOptions): T {
    const {
        strategy = 'lru',
        maxSize = 100,
        ttl = 0,
        keyGenerator = defaultKeyGenerator
    } = options ?? {};

    // 根据策略选择缓存实现
    const cache = strategy === 'lru' 
        ? new LRUCache<ReturnType<T>>(maxSize)
        : new Map<string, CacheEntry<ReturnType<T>>>();

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
        const key = keyGenerator(...args);

        // 检查缓存
        const cached = cache.get(key);
        if (cached) {
            // 检查 TTL
            if (ttl > 0) {
                const age = Date.now() - cached.timestamp;
                if (age > ttl) {
                    cache.delete(key);
                } else {
                    return cached.value;
                }
            } else {
                return cached.value;
            }
        }

        // 执行函数并缓存结果
        const result = fn.apply(this, args);

        if (!(result instanceof Promise)) {
            cache.set(key, { value: result, timestamp: Date.now() });
        } else {
            // 异步函数：等待结果后缓存
            return (result as Promise<ReturnType<T>>)
                .then(res => {
                    cache.set(key, { value: res, timestamp: Date.now() });
                    return res;
                })
                .catch(err => {
                    // 失败时不缓存
                    throw err;
                }) as ReturnType<T>;
        }

        return result;
    } as T;
}

/**
 * 缓存统计信息
 */
export interface CacheStats {
    /** 命中次数 */
    hits: number;
    /** 未命中次数 */
    misses: number;
    /** 命中率 */
    hitRate: number;
}

const cacheStatsMap = new Map<string, CacheStats>();

/**
 * 获取缓存统计
 */
export function getCacheStats(fnName: string): CacheStats | undefined {
    return cacheStatsMap.get(fnName);
}

/**
 * 重置缓存统计
 */
export function resetCacheStats(fnName?: string): void {
    if (fnName) {
        cacheStatsMap.delete(fnName);
    } else {
        cacheStatsMap.clear();
    }
}

/**
 * 高阶函数：带统计信息的缓存
 */
export function withCacheStats<T extends AnyFunction>(fn: T, options?: CacheOptions): T {
    const {
        strategy = 'lru',
        maxSize = 100,
        ttl = 0,
        keyGenerator = defaultKeyGenerator
    } = options ?? {};

    const cache = strategy === 'lru'
        ? new LRUCache<ReturnType<T>>(maxSize)
        : new Map<string, CacheEntry<ReturnType<T>>>();

    const stats: CacheStats = {
        hits: 0,
        misses: 0,
        hitRate: 0
    };

    // 使用原函数名作为统计 key
    const fnName = fn.name || `fn_${Date.now()}`;
    cacheStatsMap.set(fnName, stats);

    const cachedFn = function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
        const key = keyGenerator(...args);

        const cached = cache.get(key);
        if (cached) {
            if (ttl > 0) {
                const age = Date.now() - cached.timestamp;
                if (age > ttl) {
                    cache.delete(key);
                    stats.misses++;
                } else {
                    stats.hits++;
                    stats.hitRate = stats.hits / (stats.hits + stats.misses);
                    return cached.value;
                }
            } else {
                stats.hits++;
                stats.hitRate = stats.hits / (stats.hits + stats.misses);
                return cached.value;
            }
        }

        stats.misses++;
        stats.hitRate = stats.hits / (stats.hits + stats.misses);

        const result = fn.apply(this, args);

        if (!(result instanceof Promise)) {
            cache.set(key, { value: result, timestamp: Date.now() });
        } else {
            return (result as Promise<ReturnType<T>>)
                .then(res => {
                    cache.set(key, { value: res, timestamp: Date.now() });
                    return res;
                })
                .catch(err => {
                    throw err;
                }) as ReturnType<T>;
        }

        return result;
    } as T;

    // 保留原函数名
    Object.defineProperty(cachedFn, 'name', { value: fnName });

    return cachedFn;
}

/**
 * 手动清除缓存
 */
export function createCacheable<T extends AnyFunction>(fn: T, options?: CacheOptions) {
    const cachedFn = withCache(fn, options);
    const cache = (cachedFn as any).cache;

    return Object.assign(cachedFn, {
        /** 清除所有缓存 */
        clearCache: () => cache?.clear?.(),
        /** 清除指定键的缓存 */
        deleteCache: (...args: Parameters<T>) => {
            const key = options?.keyGenerator?.(...args) ?? defaultKeyGenerator(...args);
            cache?.delete?.(key);
        }
    });
}
