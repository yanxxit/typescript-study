// ## 可辨识联合
// TypeScript 可辨识联合（Discriminated Unions）类型，也称为代数数据类型或标签联合类型。它包含3 个要点：可辨识、联合类型和类型守卫。

// 这种类型的本质是结合联合类型和字⾯量类型的⼀种类型保护⽅法。如果⼀个类型是多个类型的联合类型，且多个类型含有⼀个公共属性，那么就可以利⽤这个公共属性，来创建不同的类型保护区块。

// 1. 可辨识
// 可辨识要求联合类型中的每个元素都含有⼀个单例类型属性，⽐如
enum CarTransmission {
  Automatic = 200,
  Manual = 300
}

interface Motorcycle {
  vType: "motorcycle"; // discriminant
  make: number; // year
}

interface Car {
  vType: "car"; // discriminant
  transmission: CarTransmission
}

interface Truck {
  vType: "truck"; // discriminant
  capacity: number; // in tons	
}

// 在上述代码中，我们分别定义了Motorcycle，Car和Truck三个接口，这些接口中都包含一个vType属性，该属性被称为可辨识的属性，而其他的属性只跟特性的接口相关。

// ## 2. 联合类型
// 基于前面定义了三个接口，我们可以创建一个 Vehicle 联合类型：
type Vehicle = Motorcycle | Car | Truck;

// 现在我们就可以开始使用 Vehicle 联合类型，对于 Vehicle 类型的变量，它可以表示不同类型的车辆。

// ## 3. 类型守卫
// 下⾯我们来定义⼀个 evaluatePrice ⽅法，该⽅法⽤于根据⻋辆的类型、容量和评估因⼦来计算价格，具体实现如下：
const EVALUATION_FACTOR = Math.PI;

function evaluatePrice(vehicle: Vehicle) {
  // return vehicle.capacity * EVALUATION_FACTOR;// 将会异常
  switch (vehicle.vType) {
    case "car":
      return vehicle.transmission * EVALUATION_FACTOR;
    case "truck":
      return vehicle.capacity * EVALUATION_FACTOR;
    case "motorcycle":
      return vehicle.make * EVALUATION_FACTOR;
  }
}

const myTruck: Truck = {
  vType: "truck",
  capacity: 9.5
}

console.log(evaluatePrice(myTruck))

// ## 5.3 类型别名
// 类型别名用来给一个类型起个新名字。
type Message = string | string[];

let great = (message: Message) => {
  // ...
}

// ## 六、交叉类型
// 在 TypeScript 中交叉类型是将多个类型合并为⼀个类型。通过 & 运算符可以将现有的多种类型叠加到⼀起成为⼀种类型，它包含了所需的所有类型的特性。
type PartialPointX = {
  x: number;
}

type Point = PartialPointX & { y: number };

let point: Point = {
  x: 1,
  y: 1
}
// 在上⾯代码中我们先定义了 PartialPointX 类型，接着使⽤ & 运算符创建⼀个新的 Point 类型，表示⼀个含有 x 和 y 坐标的点，然后定义了⼀个 Point 类型的变量并初始化。

// 6.1 同名基础类型属性的合并
// 那么现在问题来了，假设在合并多个类型的过程中，刚好出现某些类型存在相同的成员，但对应的类型⼜不⼀致，⽐如：
interface X {
  c: string;
  d: string;
}

interface Y {
  c: number;
  e: string;
}

type XY = X & Y;
type YX = Y & X;

let p: XY;
let q: YX;
// 在上⾯的代码中，接⼝ X 和接⼝ Y 都含有⼀个相同的成员 c，但它们的类型不⼀致。对于这种情况，此时 XY 类型或 YX 类型中成员 c 的类型是不是可以是 string 或 number 类型呢？⽐如下⾯的例⼦：
// p = {
//   c: 6,
//   d: "d",
//   e: "e"
// }
// 为什么接⼝ X 和接⼝ Y 混⼊后，成员 c 的类型会变成 never 呢？这是因为混⼊后成员 c 的类型为 string & number ，即成员 c 的类型既可以是 string 类型⼜可以是 number 类型。很明显这种类型是不存在的，所以混⼊后成员 c 的类型为 never 。

// ## 6.2 同名非基础类型属性的合并
// 在上⾯示例中，刚好接⼝ X 和接⼝ Y 中内部成员 c 的类型都是基本数据类型，那么如果是⾮基本数据类型的话，⼜会是什么情形。我们来看个具体的例⼦：
{
  interface D { d: boolean; }
  interface E { e: string; }
  interface F { f: number; }

  interface A { x: D; }
  interface B { x: E; }
  interface C { x: F; }

  type ABC = A & B & C;

  let abc: ABC = {
    x: {
      d: true,
      e: 'semlinker',
      f: 666
    }
  };

  console.log('abc:', abc);
}
// 在控制台中输出的结果可知，在混⼊多个类型时，若存在相同的成员，且成员类型为⾮基本数据类型，那么是可以成功合并。



// ts-node keyword_discriminant.ts