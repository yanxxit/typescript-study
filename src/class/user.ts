// type CalendarKey = 'sameDay' | 'nextDay' | 'lastDay' | 'nextWeek' | 'lastWeek' | 'sameElse';
export class Student {
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
  static getShop(name: string) {
    console.log("hello" + name)
  }
}


Student.hello();

// ts-node user.ts