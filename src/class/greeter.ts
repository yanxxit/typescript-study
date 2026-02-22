class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    console.log("greet from method");
    return "Hello, " + this.greeting;
  }

  static sayHello() {
    console.log("sayHello from static method");
    return "Hello, world";
  }
}

let greeter = new Greeter("world");

greeter.greet();

console.log("greeter = ", greeter.greeting)


Greeter.sayHello();