class Student {
  fullName: string;
  constructor(public firstName: string, public middleInitial: string, public lastName: string) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
  //对象方法
  say() {
    console.log("hello world")
    console.log("about ", this.fullName);
  }
  //静态方法
  static hello() {
    console.log("hello")
  }
}

interface IPerson {
  firstName: string;
  lastName: string;
}

namespace ClassUtils {
  export function greeter(person: IPerson): string {
    return "Hello, " + person.firstName + " " + person.lastName;
  }
}

let user = new Student("Jane", "M.", "User");
let u = new Student('admin', 'a', 'b')

u.say()
//Student
Student.hello()
ClassUtils.greeter(user)

class newStudent extends Student {
  run(): void {
    console.log("Woof! Woof!", this.fullName);
  }
}

let _newStudent = new newStudent("a", "b", "c")

_newStudent.run()



