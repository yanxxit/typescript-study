// hof.ts
type AnyFunction = (...args: any[]) => any;

/**
 * 高阶函数：为任意函数添加日志
 */
function withLogging<T extends AnyFunction>(fn: T): T {
    return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
        let fn_name = fn.name || 'anonymous';
        console.log(`[HOF LOG] Calling "${fn_name}" with`, args);

        const result = fn.apply(this, args);

        if (result instanceof Promise) {
            return result.then(res => {
                console.log(`[HOF LOG] "${fn_name}" resolved with`, res);
                return res;
            }).catch(err => {
                console.error(`[HOF LOG] "${fn_name}" rejected with`, err);
                throw err;
            }) as ReturnType<T>;
        } else {
            console.log(`[HOF LOG] "${fn_name}" returned`, result);
            return result;
        }
    } as T;
}

// 使用：普通函数（✅ 完全支持）
const add = withLogging((a: number, b: number): number => a + b);
const minus = (a: number, b: number): number => a - b;
const minus2 = withLogging(minus);

// 使用：异步函数
const fetchData = withLogging(async (url: string) => {
    const res = await fetch(url);
    return res.status;
});

// 调用
add(2, 3); // 同步日志
minus2(5, 3); // 同步日志
// fetchData('https://api-dev.tingo66.com/ping'); // 异步日志