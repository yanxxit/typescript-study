/**
 * @param d 日期
 * @param f 想要格式化的字符串
 */
function dateFormatter(d: Date | string, f?: string): Date | string {
  const date = new Date(d);
  if (f) {
    return `${date.getFullYear()}${f}${date.getMonth() + 1}${f}${date.getDate()}`
  } else {
    return new Date(d);
  }
}

/**
 * @param d 日期字符串
 */
function dealDate(d: string): number {
  return new Date(d).getTime();
}

const date = dealDate(dateFormatter('2020-7-28', '/') as string);

// 或者这么用
const a = dealDate(<string>dateFormatter('2020-7-28', '/'));

console.log(date)
console.log(a)

let num: 1 | 2 = 1;
type EventName = 'click' | 'scroll' | 'mousemove';


function mylike(event: EventName, count: number): void {
  console.log(event, count)
}

console.log(mylike("click", num))

// ts-node func.ts