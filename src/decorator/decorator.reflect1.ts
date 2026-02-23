import "reflect-metadata";
const a: () => ClassDecorator = () => {
    return (target: Function) => {

    }
}

@a()
class Tes {
    constructor(a: string) {

    }
    run(name: string) {

    }
}

console.log(Reflect.getMetadata('design:paramtypes', Tes));