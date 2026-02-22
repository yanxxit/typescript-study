# modules 模块

## 导出声明
任何声明（比如变量，函数，类，类型别名或接口）都能够通过添加export关键字来导出。
```ts
export interface StringValidator {
    isAcceptable(s: string): boolean;
}

export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```
导出语句
导出语句很便利，因为我们可能需要对导出的部分重命名，所以上面的例子可以这样改写：
```ts
class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```

## 默认导出

每个模块都可以有一个default导出。 默认导出使用default关键字标记；并且一个模块只能够有一个default导出。 需要使用一种特殊的导入形式来导入default导出。

default导出十分便利。 比如，像JQuery这样的类库可能有一个默认导出jQuery或$，并且我们基本上也会使用同样的名字jQuery或$导出JQuery。

```ts
declare let $: JQuery;
export default $;
```

```ts
export default class ZipCodeValidator {
    static numberRegexp = /^[0-9]+$/;
    isAcceptable(s: string) {
        return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
    }
}
```

```ts
import validator from "./ZipCodeValidator";
let myValidator = new validator();
```

## 外部模块
在Node.js里大部分工作是通过加载一个或多个模块实现的。 我们可以使用顶级的export声明来为每个模块都定义一个.d.ts文件，但最好还是写在一个大的.d.ts文件里。 我们使用与构造一个外部命名空间相似的方法，但是这里使用module关键字并且把名字用引号括起来，方便之后import。 例如：

```ts
// node.d.ts
declare module "url" {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }

    export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url;
}

declare module "path" {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export let sep: string;
}
```
现在我们可以`/// <reference> node.d.ts`并且使用`import url = require("url");`或`import * as URL from "url"`加载模块。

```ts
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("http://www.typescriptlang.org");
```

### 外部模块简写

假如你不想在使用一个新模块之前花时间去编写声明，你可以采用声明的简写形式以便能够快速使用它。


```ts
// declarations.d.ts
declare module "hot-new-module";
```
简写模块里所有导出的类型将是any。

```ts
import x, {y} from "hot-new-module";
x(y);
```

https://typescript.bootcss.com/modules.html

- https://typeorm.bootcss.com
- https://www.bootcdn.cn/react-bootstrap/