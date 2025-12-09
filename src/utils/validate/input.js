/**
 * 输入验证工具函数
 * 这些函数用于验证用户输入和数据格式
 */

/**
 * 验证输入内容是否为空
 * @param {string} content - 要验证的内容
 * @returns {boolean} 如果内容非空则返回 true
 */
export function validateNotEmpty(content) {
  return content && content.trim().length > 0
}

/**
 * 验证模型名称格式
 * @param {string} name - 模型名称
 * @returns {boolean} 如果格式有效则返回 true
 */
export function validateModelName(name) {
  if (!name || typeof name !== 'string') {
    return false
  }
  // 模型名称格式：name:tag 或 name
  const pattern = /^[a-zA-Z0-9_-]+(?::[a-zA-Z0-9_.-]+)?$/
  return pattern.test(name)
}

/**
 * 验证图片文件类型
 * @param {File} file - 文件对象
 * @returns {boolean} 如果是图片文件则返回 true
 */
export function validateImageFile(file) {
  if (!file || !file.type) {
    return false
  }
  return file.type.startsWith('image/')
}
