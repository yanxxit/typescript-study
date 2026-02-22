// TypeScript引入了很多静态编译语言的特性，比如class（现在是JavaScript的一部分了），interface, generics和union types等。
// 对于很多的静态语言来说，枚举是一个很非常常见的语言特性。比如，c，c#，java和swift。枚举就是你在代码里可以用的一组常量。


enum Color { Red = 1, Green, Blue = 4 }
enum Order { Start = "aaaa", Openid = "bbb", Shipping = "cccc" }

console.log(Color.Red)
console.log(Color.Green)
console.log(Color.Blue)


function getA(str: string, count: number): string {
  var r = "";
  for (let i = 0; i < count; i++) {
    r += str;
  }
  return r;
}

console.log(getA("*", 10))
console.log(Order.Start)
console.log(Order.Openid)
console.log(Order.Shipping)

enum DayOfWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
};

console.log("*".repeat(100))
console.log(DayOfWeek)
console.log(DayOfWeek.Friday)

// 这个枚举使用enum关键字声明，后面跟着DayOfWeek名称。然后我们定义枚举里可以使用的常量。
// 现在我们定义一个方法，接受这个枚举类型的参数，来判断传入的参数是不是周末。
function isItTheWeekend(day: DayOfWeek) {
  switch (day) {
    case DayOfWeek.Sunday:
    case DayOfWeek.Saturday:
      return true;

    default:
      return false;
  }
}
console.log(isItTheWeekend(1))
console.log(isItTheWeekend(DayOfWeek.Friday))
console.log(isItTheWeekend(DayOfWeek.Monday)); // log: false
