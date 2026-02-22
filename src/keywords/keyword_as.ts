interface Cat {
  action: string;
}
interface Dog {
  action: string;
}
type Animal = Cat | Dog;
let action: Animal = {} as Cat;


// as和!用于属性的读取，都可以缩小类型检查范围，都做判空用途时是等价的。
// 只是!具体用于告知编译器此值不可能为空值（null和undefined），而as不限于此。

interface SquareConfig {
  color: string;
  width?: number;
}
function createSquare(config: SquareConfig) {
  // config.color = undefined;// 报错
  if (config.color) {
    console.log(config);
  }
}

// 在Typescript中，表示断言有两种方式。一种是扩号表示法：
{
  let someValue: any = "this is a string";
  let strLength: number = (someValue).length;
  console.log(strLength)
}

// 另一种使用as关键字：
{
  let someValue: any = "this is a string";
  let strLength: number = (someValue as string).length;
  console.log(strLength)
}

// TypeScript 联合类型（|）、类型断言（＜＞、as）
// 联合类型（Union Types）：表示取值可以为多种类型中的一种，多个类型之间用 | 分隔开
// 类型断言:
// 通过断言的这种方式，告诉编译器，我知道自己在做什么，类型断言好比其他语言里的类型转换，但是不进行特殊的数据检查和解构。它没有运行时的影响。TypeScript 会假设你已经进行了必须的检查。
// 方式一：<类型>值
// 方式一：值 as 类型
// 两种方式是等价的，用哪个凭个人爱好即可，但是当在 TypeScript 里使用 JSX 时，只有 as 语法断言是被允许的。

// 获取字符串长度
{
  function getLength(v: number | string): number {
    if ((<string>v).length) {
      // string 类型
      return (v as string).length
    } else {
      // number 类型
      return v.toString().length
    }
  }
  // 使用
  getLength(1234567)
  getLength('1234567')
}

// 非空断言
// 在上下⽂中当类型检查器⽆法断定类型时，⼀个新的后缀表达式操作符 ! 可以⽤于断⾔操作对象是⾮null 和⾮ undefined 类型。
// 具体而言，x! 将从x值域中排除null和undefined。
// 1. 忽略 undefined 和 null 类型
{
  function myFunc(maybeString: string | undefined | null) {
    // Type 'string | null | undefined' is not assignable to type 'string'.
    // Type 'undefined' is not assignable to type 'string'.
    // const onlyString: string = maybeString; // Error
    const onlyString2: string = <string>maybeString; // Error
    const ignoreUndefinedAndNull: string = maybeString!; // OK
    console.log(onlyString2, ignoreUndefinedAndNull)
  }
}

// 2. 调用函数时忽略 undefined 类型
{
  // type NumGenerator = () => number;
  // function myFunc(numGenerator: NumGenerator | undefined) {
  //   // Object is possibly 'undefined'.(2532)
  //   // Cannot invoke an object which is possibly 'undefined'.(2722)
  //   const num1 = numGenerator(); // Error
  //   const num2 = numGenerator!(); // OK
  // }
}
// 因为 ! ⾮空断⾔操作符会从编译⽣成的 JavaScript 代码中移除，所以在实际使⽤的过程中，要特别注意。⽐如下⾯这个例⼦：
{
  const a: number | undefined = undefined;
  const b: number = a!;
  console.log(b);
}

// TypeScript中的类型断言[as语法 | <>语法]
{
  /**
 * @param d 日期
 * @param f 想要格式化的字符串
 */
  function dateFormatter(d: Date | string, f?: string) {
    const date = new Date(d);
    if (f) {
      return `${date.getFullYear()}${f}${date.getMonth() + 1}${f}${date.getDate()}`
    } else {
      return new Date(d);
    }
  }

  /**
   * @param d 日期字符串
   */
  function dealDate(d: string) {
    return new Date(d).getTime();
  }

  const date = dealDate(dateFormatter('2020-7-28', '/') as string);

  // 或者这么用
  const a = dealDate(<string>dateFormatter('2020-7-28', '/'));

  console.log(date, a)
}

// 4.4 自动以类型保护的类型谓词
{
  function isNumber(x: any): x is number {
    return typeof x === "number";
  }

  function isString(x: any): x is string {
    return typeof x === "string"
  }

  console.log(isNumber("a"))
  console.log(isNumber(123))

}


// ts-node keyword_as.ts