namespace BaseUtils {
    export function greeter(person: string): string {
        return "Hello, " + person;
    }
}

const isDone: boolean = false;
const decLiteral: number = 6;
const name1: string = "Gene";
const age: number = 37;
const sentence: string = `Hello, my name is ${name1}.`

let str01: string = `${age + 1}`;
let user1: string = "Jane User";

// function getType<T>(arg:T):T{

// }
console.log(BaseUtils.greeter(user1))

// ts-node-dev --respawn --transpile-only --ignore node_modules base.ts

// ts-node-dev --respawn --transpile-only --ignore node_modules src/demo/base.ts
// ts-node-dev --respawn --transpile-only --ignore node_modules --compiler swc  src/demo/base.ts