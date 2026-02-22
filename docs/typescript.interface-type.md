# typescript interface vs type

在 TypeScript 中，`interface` 和 `type` 都可以用来定义对象的形状（shape），但它们在**设计哲学、能力范围和使用场景**上存在重要区别。以下是详细对比：

---

## 📊 核心区别速览表

| 特性 | `interface` | `type` |
|------|-------------|--------|
| **可扩展性（合并）** | ✅ 支持声明合并（Declaration Merging） | ❌ 不支持 |
| **基本类型别名** | ❌ 不能定义 `string`、`number` 等别名 | ✅ 可以：`type ID = string` |
| **联合类型 / 交叉类型** | ❌ 不能直接表示 `A \| B` 或 `A & B` | ✅ 原生支持 |
| **元组、字面量类型** | ❌ 有限支持 | ✅ 完全支持 |
| **映射类型（Mapped Types）** | ❌ 不支持 | ✅ 支持（如 `Partial<T>`） |
| **继承（extends）** | ✅ `interface A extends B` | ⚠️ 用交叉类型 `&` 模拟 |
| **计算属性** | ❌ 不能用 `in keyof T` | ✅ 可用于高级类型编程 |
| **性能/编译输出** | 更轻量（仅类型信息） | 同左（两者都只存在于编译期） |

---

## 🔍 详细对比与示例

### 1. **基本对象定义 —— 两者几乎等价**
```ts
// interface
interface User {
  name: string;
  age: number;
}

// type
type User = {
  name: string;
  age: number;
};
```
✅ 此时可互换，推荐用 `interface`（更符合“契约”语义）。

---

### 2. **声明合并（Declaration Merging）—— interface 独有**
```ts
interface User {
  name: string;
}

// 合并！添加新属性
interface User {
  email: string;
}

// 现在 User = { name: string; email: string; }
const u: User = { name: "Alice", email: "a@example.com" };
```

> 💡 这对**扩展第三方库类型**或**模块化定义**非常有用。
> `type` 无法做到：
> ```ts
> type User = { name: string };
> type User = { email: string }; // ❌ 错误：重复标识符
> ```

---

### 3. **联合类型（Union）与交叉类型（Intersection）—— type 专属**
```ts
// 联合类型：ID 可以是 string 或 number
type ID = string | number;

// 交叉类型：组合多个类型
type Admin = User & { role: string };

// 字面量类型
type Status = 'pending' | 'success' | 'failed';

// 元组
type Point = [number, number];
```

> ❌ `interface` 无法直接表达这些。

---

### 4. **继承 vs 组合**
```ts
// interface 继承
interface Animal {
  name: string;
}
interface Dog extends Animal {
  bark(): void;
}

// type 用交叉类型模拟
type Animal = { name: string };
type Dog = Animal & { bark(): void };
```

✅ `interface` 的 `extends` 更语义化；`type` 的 `&` 更灵活（可组合任意类型）。

---

### 5. **高级类型编程 —— type 更强大**
```ts
// 映射类型（只能用 type）
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type PartialUser = Partial<User>; // 自动生成可选属性

// 条件类型
type IsString<T> = T extends string ? true : false;
```

> `interface` 无法参与这类类型运算。

---

## ✅ 使用建议（官方 + 社区共识）

| 场景 | 推荐 |
|------|------|
| 定义**对象/类的公共契约**（如 API 响应、组件 props） | ✅ `interface` |
| 需要**扩展已有类型**（如全局变量、第三方库） | ✅ `interface`（利用声明合并） |
| 定义**原始类型别名**（如 `type UUID = string`） | ✅ `type` |
| 使用**联合/交叉/字面量/元组** | ✅ `type` |
| 编写**工具类型**（如 `Partial<T>`, `Pick<T,K>`） | ✅ `type` |
| 在 React/Vue 中定义组件 Props | ✅ 通常用 `interface`（更清晰） |

> 📌 **TypeScript 官方建议**：
> > “**Prefer `interface` over `type` for object shapes**”
> > （对于对象形状，优先使用 `interface`）

---

## 🧪 实际项目示例

### ✅ 用 `interface` 定义 API 响应
```ts
interface UserProfile {
  id: number;
  username: string;
  avatar?: string;
}

// 后续可扩展
interface UserProfile {
  followers: number; // 声明合并
}
```

### ✅ 用 `type` 定义状态机
```ts
type OrderStatus = 'created' | 'paid' | 'shipped' | 'cancelled';

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

---

## ❗ 常见误区

- **误区**：“`type` 是 `interface` 的超集，所以只用 `type` 就够了”
  **纠正**：虽然 `type` 功能更强，但 `interface` 的**可合并性**在大型项目中不可替代，且语义更清晰。

- **误区**：“`interface` 不能实现复杂逻辑”
  **纠正**：复杂逻辑交给 `type`，简单契约用 `interface`，二者互补。

---

## 🔚 总结

| 选择 | 当你…… |
|------|--------|
| **`interface`** | 定义**对象结构**、需要**扩展性**、强调**契约** |
| **`type`** | 需要**联合/交叉类型**、**原始类型别名**、**高级类型操作** |

> 💡 **黄金法则**：
> **能用 `interface` 的地方就用 `interface`，只有 `interface` 无法满足时才用 `type`。**

这样既保持代码清晰，又充分利用 TypeScript 的类型系统优势。
