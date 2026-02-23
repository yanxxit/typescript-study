/**
 * 计算器类，提供基本的算术运算功能
 */
export class Calculator {
  /**
   * 加法运算
   * @param a 第一个加数
   * @param b 第二个加数
   * @returns 两个数的和
   */
  add(a: number, b: number): number {
    return a + b;
  }

  /**
   * 减法运算
   * @param a 被减数
   * @param b 减数
   * @returns 两个数的差
   */
  subtract(a: number, b: number): number {
    return a - b;
  }

  /**
   * 乘法运算
   * @param a 第一个乘数
   * @param b 第二个乘数
   * @returns 两个数的积
   */
  multiply(a: number, b: number): number {
    return a * b;
  }

  /**
   * 除法运算
   * @param a 被除数
   * @param b 除数
   * @returns 两个数的商
   * @throws 当除数为0时抛出错误
   */
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('除数不能为0');
    }
    return a / b;
  }

  /**
   * 执行算术表达式
   * @param expression 算术表达式字符串，支持 +, -, *, / 运算
   * @returns 表达式的计算结果
   * @throws 当表达式格式错误或除数为0时抛出错误
   */
  evaluate(expression: string): number {
    // 简单的表达式解析，仅支持两个数的运算
    const match = expression.match(/^\s*(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)\s*$/);
    if (!match) {
      throw new Error('表达式格式错误，仅支持两个数的运算');
    }

    const [, aStr, operator, bStr] = match;
    const a = parseFloat(aStr);
    const b = parseFloat(bStr);

    switch (operator) {
      case '+':
        return this.add(a, b);
      case '-':
        return this.subtract(a, b);
      case '*':
        return this.multiply(a, b);
      case '/':
        return this.divide(a, b);
      default:
        throw new Error('不支持的运算符');
    }
  }
}

/**
 * 命令行计算器示例
 */
if (require.main === module) {
  const calculator = new Calculator();

  // 测试基本运算
  console.log('1 + 2 =', calculator.add(1, 2));
  console.log('5 - 3 =', calculator.subtract(5, 3));
  console.log('4 * 6 =', calculator.multiply(4, 6));
  console.log('8 / 2 =', calculator.divide(8, 2));

  // 测试表达式计算
  try {
    console.log('10 + 5 =', calculator.evaluate('10 + 5'));
    console.log('20 * 3 =', calculator.evaluate('20 * 3'));
    console.log('15 / 3 =', calculator.evaluate('15 / 3'));
  } catch (error) {
    console.error('计算错误:', (error as Error).message);
  }
}