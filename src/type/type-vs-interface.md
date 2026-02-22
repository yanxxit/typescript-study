# type vs interface

可以在一定程度上互换使用，但有一些细微的差别和最佳实践：

在 TypeScript 中，`type` 和 `interface` 都用于定义对象类型，但它们有一些关键区别：

## 1. **基本语法**

```typescript
// interface
interface User {
  id: number;
  name: string;
  age?: number; // 可选属性
}

// type
type User = {
  id: number;
  name: string;
  age?: number;
};
```

## 2. **主要区别**

### 扩展方式不同
```typescript
// interface - 使用 extends
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// type - 使用 & (交集)
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};
```

### 合并声明（Declaration Merging）
```typescript
// interface 可以合并
interface User {
  name: string;
}

interface User {
  age: number;
}

// 相当于: { name: string; age: number; }

// type 不能合并，会报错
type User = { name: string };
type User = { age: number }; // ❌ 错误
```

### 类型别名可以定义更多类型
```typescript
// 原始类型
type ID = string | number;

// 元组
type Point = [number, number];

// 联合类型
type Status = 'pending' | 'success' | 'error';

// 映射类型
type Optional<T> = { [K in keyof T]?: T[K] };

// 条件类型
type IsString<T> = T extends string ? true : false;
```

## 3. **性能考虑**
- `interface` 在智能提示和错误检查中通常有更好的性能
- 大型项目中使用 `interface` 可能更有优势

## 4. **使用建议**

### 推荐使用 `interface` 的情况：
- 定义对象结构，特别是需要扩展的
- 类需要实现的契约
- 需要声明合并的场景
- 公开的 API 定义

### 推荐使用 `type` 的情况：
- 定义联合类型、交叉类型
- 定义元组类型
- 使用映射类型、条件类型
- 简单的类型别名

## 5. **最佳实践**
```typescript
// 对象类型 - 优先使用 interface
interface Props {
  title: string;
  onClick: () => void;
}

// 联合类型、交叉类型 - 使用 type
type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonProps = Props & { variant: ButtonVariant };

// 类实现 - 使用 interface
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(message);
  }
}
```

## 6. **一致性规则**
大多数团队采用以下约定：
- 对象类型优先使用 `interface`
- 非对象类型使用 `type`
- 保持项目内一致

两者在大部分情况下可以互换，主要区别在于 `interface` 支持声明合并，而 `type` 支持更广泛的类型表达式。