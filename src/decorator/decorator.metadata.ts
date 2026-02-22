// @ts-nocheck
import 'reflect-metadata';
// 简化版的类型日志装饰器
// 不依赖于 reflect-metadata，而是直接在装饰器中记录属性信息
function logType(type: Function) {
    return function(target: any, key: string) {
        console.log(`logType ==> ${key} type: ${type.name}`);
    };
}

class Demo {
    @logType(String)
    public attr1: string;
}

// 创建一个 Demo 实例并访问 attr1，触发装饰器打印类型信息
const demo = new Demo();
console.log(demo.attr1); // 输出 undefined，但装饰器已打印 attr1 type: String
