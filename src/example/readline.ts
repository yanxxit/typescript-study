// src/index.ts
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 监听 Ctrl+C
rl.on('SIGINT', async () => {
  console.log('\n收到退出信号...');
  // await cleanup(); // 执行清理操作
  rl.close();
  process.exit(0);
});

// 执行主任务
async function main() {
  // ... 业务逻辑
  console.log('按 Ctrl+C 退出');
  await new Promise(() => { }); // 阻塞主线程等待信号
}

main();