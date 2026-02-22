// @ts-nocheck
function ReadOnly(target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = false;
    return descriptor;
}

class Circle {
    private _radius: number;

    constructor(radius: number) {
        this._radius = radius;
    }

    @ReadOnly
    get radius() {
        return this._radius;
    }
}

// 使用案例：演示只读属性装饰器
const c = new Circle(5);
console.log('半径：', c.radius); // 5

// 尝试修改会静默失败（严格模式下会抛错）
// c.radius = 10; // 无效，属性只读
console.log('尝试修改后的半径：', c.radius); // 仍为 5
