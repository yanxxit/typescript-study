
// 1. 基本语法 基本语法相同

{
  // interface
  interface User {
    id: number;
    name: string;
    age?: number; // 可选属性
  }
  const user: User = {
    id: 1,
    name: "John",
  };
  console.log(user.name)// John
}

{
  type User = {
    id: number;
    name: string;
    age?: number;
  };
  const user: User = {
    id: 1,
    name: "John",
  };
  console.log(user.name)// John
}


// 2. 主要区别

// ### 扩展方式不同

{
  // interface - 使用 extends
  interface Animal {
    name: string;
  }

  interface Dog extends Animal {
    breed: string;
  }
  const dog: Dog = {
    name: "Rex",
    breed: "German Shepherd"
  };
  console.log(dog)
}

{
  // type - 使用 & (交集)
  type Animal = {
    name: string;
  };

  type Dog = Animal & {
    breed: string;
  };
  const dog: Dog = {
    name: "Rex",
    breed: "German Shepherd"
  };
  console.log(dog)
}

// ### 合并声明（Declaration Merging）

{
  // interface 可以合并
  interface User {
    name: string;
  }

  interface User {
    age: number;
  }
  // 相当于: { name: string; age: number; }
  const user: User = {
    name: "John",
    age: 30,
  };

  console.log("interface 可以合并", user)
}

{
  // type 不能合并，会报错
  type User = { name: string };
  // type User = { age: number }; // ❌ 错误
}

// ### 类型别名可以定义更多类型

{
  // 原始类型
  type ID = string | number;

  let id: ID = 1;
  console.log(id)
  id = "123";
  console.log(id)
  // id = false// 报错


  // 元组
  type Point = [number, number];

  let point: Point = [1, 2];
  console.log(point)

  // 联合类型
  type Status = 'pending' | 'success' | 'error';

  let status: Status = 'pending';
  // status = 'java';// 报错

  // 映射类型
  type Optional<T> = { [K in keyof T]?: T[K] };

  type User = {
    id: number;
    name: string;
  };

  let user: Optional<User> = {};
  console.log(user.id)

  // 条件类型
  type IsString<T> = T extends string ? true : false;

  let isString: IsString<string> = true;
  console.log(isString)

}

// ## 5. **最佳实践**

{
  // 对象类型 - 优先使用 interface
  interface Props {
    title: string;
    onClick: () => void;
  }

  // 联合类型、交叉类型 - 使用 type
  type ButtonVariant = 'primary' | 'secondary' | 'outline';
  type ButtonProps = Props & { variant: ButtonVariant };

  let buttonProps: ButtonProps = {
    title: '1. Click me',
    onClick: () => {
      console.log('Button clicked', buttonProps.variant, buttonProps.title);
    },
    variant: 'primary'
  };

  buttonProps.onClick();


  // 类实现 - 使用 interface
  interface Logger {
    log(message: string): void;
  }

  class ConsoleLogger implements Logger {
    log(message: string) {
      console.log(message);
    }
  }
}




// deno run type.test.ts