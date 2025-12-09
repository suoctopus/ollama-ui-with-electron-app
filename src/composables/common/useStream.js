/**
 * 流式响应处理 Composable
 * 封装流式数据读取和解析逻辑
 * 
 * 需求：2.1.1 - API 调用应在 composables 中实现
 */
export function useStream() {
  /**
   * 处理流式响应
   * @param {Response} response - fetch 响应对象
   * @param {Function} onChunk - 处理每个数据块的回调函数
   * @returns {Promise<void>}
   */
  const processStream = async (response, onChunk) => {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            onChunk(data)

            // 检查是否应该终止流
            if (data.done === true) {
              return
            }
          } catch (e) {
            console.error('Failed to parse chunk:', e)
            // 继续处理下一行，不中断整个流
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * 处理聊天流式响应
   * 专门处理 /api/chat 端点的流式响应，提取 thinking 和 content 字段
   * @param {Response} response - fetch 响应对象
   * @param {Function} onChunk - 处理每个数据块的回调函数
   * @returns {Promise<void>}
   */
  const processChatStream = async (response, onChunk) => {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            
            // 提取 thinking 和 content 字段
            if (data.message) {
              const streamData = {
                ...data,
                content: data.message.content || '',
                thinking: data.message.thinking || '',
              }
              onChunk(streamData)
            } else {
              onChunk(data)
            }

            // 检查是否应该终止流
            if (data.done === true) {
              return
            }
          } catch (e) {
            console.error('Failed to parse chunk:', e)
            // 继续处理下一行，不中断整个流
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * 创建流式请求处理器
   * 返回一个可以处理流式响应的函数
   * @param {Function} onChunk - 处理每个数据块的回调函数
   * @param {boolean} isChatStream - 是否为聊天流（需要提取 message 字段）
   * @returns {Function} - 处理响应的函数
   */
  const createStreamHandler = (onChunk, isChatStream = false) => {
    return async (response) => {
      if (isChatStream) {
        await processChatStream(response, onChunk)
      } else {
        await processStream(response, onChunk)
      }
    }
  }

  return {
    processStream,
    processChatStream,
    createStreamHandler,
  }
}
