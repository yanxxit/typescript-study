// 函数类型
// 接口能够描述JavaScript中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型。

// 为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。


interface SearchFunc {
  (source: string, subString: string): boolean;
}

// 我们可以像使用其它接口一样使用这个函数类型的接口
{
  let mySearch: SearchFunc;
  mySearch = function (source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
  }
}

// 对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。
{
  let mySearch: SearchFunc;
  mySearch = function (src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
  }
}