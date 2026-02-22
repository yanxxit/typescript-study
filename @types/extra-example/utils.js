let count = 10
let songName = '大鱼'
let position = {
  x: 0,
  y: 0
}
function add(x, y) {
  return x + y
}
function changeDirection(direction) {
  console.log(direction)
}
const fomartPoint = point => {
  console.log('当前坐标：', point)
}
module.exports = { count, songName, position, add, changeDirection, fomartPoint }