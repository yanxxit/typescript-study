// infer 是在 typescript 2.8中新增的关键字。
// infer 可以在 extends 条件类型的字句中，在真实分支中引用此推断类型变量，推断待推断的类型。
// 例如：用infer推断函数的返回值类型
// https://www.jb51.net/article/216050.htm
type ReturnType1<T> = T extends (...args: any[]) => infer R ? R : any;

type fn = () => number
type fnReturnType = ReturnType1<fn> // number

// 在这个例子中，

// T extends U ? X : Y的形式为条件类型。

// infer R代表待推断的返回值类型，如果T是一个函数(...args: any[]) => infer R，则返回函数的返回值R，否则返回any

// 加深理解 反解 Promise

// promise 响应类型
type PromiseResType<T> = T extends Promise<infer R> ? R : T

// 验证
async function strPromise() {
  return 'string promise'
}

interface Person {
  name: string;
  age: number;
}
async function personPromise() {
  return {
    name: 'p',
    age: 12
  } as Person
}

type StrPromise = ReturnType<typeof strPromise> // Promise<string>
// 反解
type StrPromiseRes = PromiseResType<StrPromise> // str

type PersonPromise = ReturnType<typeof personPromise> // Promise<Person>
// 反解
type PersonPromiseRes = PromiseResType<PersonPromise> // Person
