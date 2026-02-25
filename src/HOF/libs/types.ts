// types.ts - 通用类型定义

/**
 * 任意函数类型
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * 函数执行结果包装器
 */
export interface ExecutionResult<T> {
    /** 执行结果 */
    result: T;
    /** 执行耗时 (ms) */
    duration: number;
    /** 是否成功 */
    success: boolean;
    /** 错误信息（如果有） */
    error?: unknown;
}

/**
 * 缓存策略
 */
export type CacheStrategy = 'lru' | 'ttl' | 'forever';

/**
 * 缓存配置选项
 */
export interface CacheOptions {
    /** 缓存策略，默认 'lru' */
    strategy?: CacheStrategy;
    /** 最大缓存条目数（仅 LRU 策略） */
    maxSize?: number;
    /** 缓存过期时间 (ms)，0 表示永不过期 */
    ttl?: number;
    /** 自定义缓存键生成函数 */
    keyGenerator?: (...args: any[]) => string;
}

/**
 * 重试配置选项
 */
export interface RetryOptions {
    /** 最大重试次数，默认 3 */
    maxRetries?: number;
    /** 重试延迟 (ms)，默认 1000 */
    delay?: number;
    /** 延迟递增倍数，默认 2（指数退避） */
    backoff?: number;
    /** 仅对特定错误进行重试 */
    retryOn?: (error: unknown) => boolean;
    /** 重试回调 */
    onRetry?: (attempt: number, error: unknown) => void;
}

/**
 * 日志配置选项
 */
export interface LoggingOptions {
    /** 是否启用日志，默认 true */
    enabled?: boolean;
    /** 是否记录函数调用参数，默认 true */
    logArgs?: boolean;
    /** 是否记录函数返回值，默认 true */
    logResult?: boolean;
    /** 是否记录执行时间，默认 true */
    logDuration?: boolean;
    /** 自定义 logger 实例 */
    logger?: Logger;
}

/**
 * 简单 Logger 接口
 */
export interface Logger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    debug(message: string): void;
}

/**
 * 计时器配置选项
 */
export interface TimingOptions {
    /** 是否启用计时，默认 true */
    enabled?: boolean;
    /** 时间单位，默认 'ms' */
    unit?: 'ms' | 's' | 'us';
    /** 自定义 logger 实例 */
    logger?: Logger;
    /** 超过此阈值 (ms) 时记录警告 */
    warnThreshold?: number;
    /** 超过此阈值 (ms) 时记录错误 */
    errorThreshold?: number;
}
