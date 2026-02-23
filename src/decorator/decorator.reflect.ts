// @ts-nocheck
import "reflect-metadata";

// 简化版的性别装饰器
// 不依赖于 reflect-metadata，直接处理传入的参数
class People {
    sex: string
}

class Women implements People {
    sex: string = '女生'
}

class Man implements People {
    sex: string = '男生'
}


function SexDecorate(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    let orgMethod = descriptor.value
    descriptor.value = function (obj: People) {
        // 创建一个新对象，复制原始对象的属性
        const decoratedObj = { ...obj };
        // 修改性别为中性
        decoratedObj.sex = '中性';
        // 调用原始方法，传入修改后的对象
        orgMethod.call(this, decoratedObj);
    }
}

class Student {
    @SexDecorate
    getSex(obj: People) {
        console.log(obj);
    }
}

let man = new Man()
let women = new Women()

let std = new Student()
std.getSex(man)
std.getSex(women)