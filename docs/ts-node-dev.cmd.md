# ts-node-dev 常见命令和配置


## 命令

```sh
ts-node-dev src/basic/primitive_types.ts  --compiler swc --transpile-only --ignore node_modules

ts-node-dev basic/primitive_types.ts --respawn --transpile-only --ignore node_modules
```

- --respawn: 自动重启
- --transpile-only: 只编译，不缓存

- --ignore: 忽略某些目录
- --compiler: 使用指定的编译器
