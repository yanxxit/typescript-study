# reflect-metadata

反射元数据（Reflect Metadata）是一个实验性的 API，用于在声明装饰器时执行元数据类型注解和元数据反射。

```sh
npm install reflect-metadata --save
```
然后，你需要在全局范围内导入反射 API:

```ts
import 'reflect-metadata';
```
在 TypeScript 配置文件 tsconfig.json 中，你需要开启 emitDecoratorMetadata 选项:

```json
{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
    }
}
```
