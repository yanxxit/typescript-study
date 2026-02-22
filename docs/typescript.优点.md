# typescript 优点

## 强类型

## vscode IDE 支持
- 在写代码时，会有类型提示

## trpc 客户端使用trpc服务时特别友好

- 客户端会引用对应的类型，这样，在客户端使用时，会有提醒

```ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './router';// 这是服务端定义的路由类型

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

async function main() {
  try {

    const helloResponse = await trpc.hello.query();// 客户端可以通过.的方式，访问服务端定义的路由，并且可以获得类型提示，否则要看文档才能调用。
    console.log('Hello Response:', helloResponse.message);

    const greetResponse = await trpc.greet.query({ name: 'Alice' });
    console.log('Greet Response:', greetResponse.message);

    const userResponse = await trpc.createUser.mutate({ name: 'Bob' });
    console.log('Created user:', userResponse);
  } catch (error) {
    console.error('Error:', error);
  }

}

main();
```

## AI 友好

针对TS的项目，在开发过程中，AI使用了过期的代码，有些属性和当前版本不一致，导致编译失败，然后AI通过TS类型，使用最新的属性结构，从而解决了问题。

如果只使用js，那么可能需要到执行的步骤才会出现报错，也有可能不报错，或者等到特定场景下才报错，这样AI就很难定位问题。

- TS 是对AI友好的代码