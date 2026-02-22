// 继承接口
// 和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。

{
  interface Shape {
    color: string;
  }

  interface Square extends Shape {
    sideLength: number;
  }

  let square = <Square>{};
  square.color = "blue";
  square.sideLength = 10;

  console.log("接口也可以相互继承 = ", square);

  let square1: Square = { color: "red", sideLength: 20 };
  console.log("接口也可以相互继承2 = ", square1);
}

// 一个接口可以继承多个接口，创建出多个接口的合成接口。

{
  interface Shape {
    color: string;
  }

  interface PenStroke {
    penWidth: number;
  }

  interface Square extends Shape, PenStroke {
    sideLength: number;
  }

  let square = <Square>{};
  square.color = "blue";
  square.sideLength = 10;
  square.penWidth = 5.0;

  console.log("一个接口可以继承多个接口，创建出多个接口的合成接口 = ", square);

  let square1: Square = { color: "red", sideLength: 20, penWidth: 5.0 };
  console.log("一个接口可以继承多个接口，创建出多个接口的合成接口2 = ", square1);
}