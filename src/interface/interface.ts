import { type } from "os";

/**
 * 接口
 */
declare interface Person {
  firstName: string;
  lastName: string;
}

namespace InterfaceUtils {
  export function greeter(person: Person) {
    console.log(person.firstName)
    return "Hello, " + person.firstName + " " + person.lastName;
  }
}

let user: Person = { firstName: "Jane", lastName: "User" };
user.firstName = "aaa"
InterfaceUtils.greeter(user)

interface IPrint {
  print(): void;
}
interface IStudent extends Person {
  /** 学生编号 */
  student_no: string;
  age?: number;
}
interface IUser extends Person {
  /** 学生编号 */
  student_no: string;
  age?: number;
  remark?: string;
  username: string;
  password: string;
}

let stduent: IStudent = { firstName: "first", lastName: "last", student_no: "1001", age: 12 };
console.log(stduent.student_no);

class A implements IPrint { //实现接口
  print() {  //实现接口中的方法
    console.log("实现接口");
  }
}

var b = new A();
b.print()

type newType = number & string;
let a: newType;

interface A {
  d: number,
  z: string,
}

interface B {
  f: string;
  g: string;
}
type C = A & B;
let c: C;

