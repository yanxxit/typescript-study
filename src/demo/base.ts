// 定义一个用户接口
interface User {
  id: number;
  name: string;
  age: number;
}

// 创建用户列表
const users: User[] = [
  { id: 1, name: "张三", age: 28 },
  { id: 2, name: "李四", age: 32 },
  { id: 3, name: "王五", age: 25 }
];

// 根据年龄过滤用户
function filterUsersByAge(minAge: number): User[] {
  return users.filter(user => user.age >= minAge);
}

// 打印符合条件的用户
const adults = filterUsersByAge(26);
console.log("年龄大于等于26岁的用户：", adults);
