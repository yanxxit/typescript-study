# interface 接口
> typescript interface 接口 和golang的interface和struct相比，哪个更像

TypeScript的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

## 通用配置

```js
interface Person {
  readonly id: number;
  name: string;
  age?: number;
  [propName: string]: string;
}

let xcatliu: Person = {
  name: 'Xcat Liu',
  age: 25,
  website: 'http://xcatliu.com',
};
```


## 使用外部文件的接口

interfaces.ts 文件提取出来，方便多个模块共享，减少项目重复
```ts
// app/controller/interfaces.ts
//将接口发布出来
export interface Shop {
  name: string;
  address: string;
  order?: number;
}

export interface Manager {
  /** 用户名称 */
  name: string;
  /** 登录id */
  manager_id: string;
  /** 店铺id */
  shop_id: string;
  /** 密码 */
  pwd: string;
  /** 排序 */
  order?: number;
}
```

```ts
// app/controller/home.ts
import { Shop, Manager } from './interfaces';//一定要通过import进行导入

  /**
* @api {post} /home/manager 2、manager
* @apiName /home/manager post
* @apiGroup accuse
* @apiVersion  1.0.0
* @apiDescription 2、manager
* 外网使用：添加前缀tingo-service
* @apiInterface (./app/controller/interfaces.ts) {Manager}//针对项目的绝对路径
* 1. 这种方式在win和linux下是OK的
* 2. apidoc-plugin-ts
*/
public async manager() {
  // 使用引用模块
  const manager: Manager = { name: '张三', manager_id: 'zhangsan', shop_id: 'shopId', pwd: '123456' };
  this.ctx.body = getManager(manager);
}
```


## interface 研究方向
- 声明文件编写
- 如何组织typescript接口：http://cn.voidcc.com/question/p-hdbwfqyl-mn.html
- 命名空间
- typescript interface 的声明和使用必须在一个文件下面吗
- http://myfjdthink.com/2018/09/26/api-%E6%8E%A5%E5%8F%A3%E4%B8%8E-typescript-interface/
- 如何编写 Typescript 声明文件：https://segmentfault.com/a/1190000016684583
- https://my.oschina.net/fenying/blog/747184


## 研究其写法
- https://github.com/blendsdk/blendjs/blob/devel/blend/src/container/Box.ts
- 引用及命名空间


## 参考
- https://nodelover.gitbook.io/typescript/sheng-ming-he-bing#jie-kou-he-bing
- https://www.tslang.cn/docs/handbook/declaration-merging.html
- https://typescript.bootcss.com/interfaces.html
