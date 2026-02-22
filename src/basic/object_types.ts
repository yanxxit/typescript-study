// Object Types 对象类型

// 1. 对象字面量类型

{
  let person: { name: string; age: number } = {
    name: "Alice",
    age: 30
  };

  console.log(person); // 输出：{ name: 'Alice', age: 30 }
}

// 2. 接口（Interface）
// 定义与继承：

{
  interface User {
    name: string;
    age: number;
  }

  interface Admin extends User {
    role: string;
  }

  let admin: Admin = {
    name: "Bob",
    age: 25,
    role: "admin"
  }
  console.log(admin); // 输出：{ name: 'Bob', age: 25, role: 'admin' }
}