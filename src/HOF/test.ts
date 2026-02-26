function withLogging1(fn: Function) {
    return fn
}
function withRetry1(fn: Function) {
    return fn
}

const Decorators = {
    log: withLogging1,
    retry: withRetry1,
};

const api = Decorators.log(Decorators.retry(fetchData));