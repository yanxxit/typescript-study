/**
 * 用户信息接口定义
 * @interface User
 * @property {string} id - 用户唯一标识
 * @property {string} [name] - 用户姓名（可选）
 * @property {number} age - 用户年龄
 */
export interface User {
  id: string;
  name?: string;
  age: number;
}

/**
 * 获取用户信息
 * @param {string} userId - 用户ID
 * @returns {Promise<User>} 用户信息对象
 * @example
 * ```typescript
 * const user = await getUser('123');
 * console.log(user.name);
 * ```
 */
async function getUser(userId: string): Promise<User> {
  // 实现逻辑

  return {
    id: userId,
    age: 30,
  };
}