/**
 * 消息转换工具函数
 * 这些函数用于在不同格式之间转换消息数据
 */

/**
 * 将 API 响应转换为消息对象
 * @param {Object} response - API 响应对象
 * @returns {Object} 消息对象
 */
export function transformApiResponseToMessage(response) {
  return {
    content: response.message?.content || response.content || '',
    thinking: response.message?.thinking || response.thinking || '',
    role: response.message?.role || 'assistant'
  }
}

/**
 * 将消息列表转换为 API 请求格式
 * @param {Array} messages - 消息列表
 * @returns {Array} API 格式的消息列表
 */
export function transformMessagesToApiFormat(messages) {
  return messages
    .filter(msg => !msg.hidden)
    .map(msg => ({
      role: msg.role,
      content: msg.content,
      images: msg.images
    }))
}

/**
 * 提取消息中的图片 base64 数据
 * @param {string} dataUrl - 图片 data URL
 * @returns {string|null} base64 编码的图片数据，如果无效则返回 null
 */
export function extractImageBase64(dataUrl) {
  if (!dataUrl || !dataUrl.includes('base64,')) {
    return null
  }
  return dataUrl.split('base64,')[1]
}
