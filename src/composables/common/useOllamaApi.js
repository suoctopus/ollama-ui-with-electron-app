import { useApi } from './useApi'
import { useStream } from './useStream'

/**
 * Ollama API 封装
 * 提供所有 Ollama API 端点的调用方法
 * 
 * 需求：2.1.1 - API 调用应在 composables 中实现
 */

/**
 * 生成聊天响应（流式）
 * @param {string} model - 模型名称
 * @param {Array} messages - 消息列表
 * @param {object} options - 生成选项
 * @param {function} onChunk - 流式数据回调
 */
export async function generateChat(model, messages, options = {}, onChunk) {
  const { post } = useApi()
  const { processStream } = useStream()

  const requestBody = {
    model,
    messages,
    stream: options.stream !== false,
    options: {}
  }

  // Add optional parameters
  if (options.temperature !== undefined) {
    requestBody.options.temperature = options.temperature
  }
  if (options.top_p !== undefined) {
    requestBody.options.top_p = options.top_p
  }
  if (options.top_k !== undefined) {
    requestBody.options.top_k = options.top_k
  }
  if (options.seed !== undefined && options.seed !== -1) {
    requestBody.options.seed = options.seed
  }
  if (options.num_predict !== undefined) {
    requestBody.options.num_predict = options.num_predict
  }
  if (options.repeat_penalty !== undefined) {
    requestBody.options.repeat_penalty = options.repeat_penalty
  }
  if (options.num_ctx !== undefined) {
    requestBody.options.num_ctx = options.num_ctx
  }

  const response = await post('/api/chat', requestBody)

  if (options.stream !== false && onChunk) {
    await processStream(response, onChunk)
  } else {
    return await response.json()
  }
}

/**
 * 列出本地模型
 * @returns {Promise<object>} - 模型列表
 */
export async function listModels() {
  const { get } = useApi()
  return await get('/api/tags')
}

/**
 * 列出正在运行的模型
 * @returns {Promise<object>} - 运行中的模型列表
 */
export async function listRunningModels() {
  const { get } = useApi()
  return await get('/api/ps')
}

/**
 * 删除模型
 * @param {string} name - 模型名称
 * @returns {Promise<boolean>} - 是否成功
 */
export async function deleteModel(name) {
  const { del } = useApi()
  try {
    await del('/api/delete', { name })
    return true
  } catch (error) {
    console.error('Delete model error:', error)
    return false
  }
}

/**
 * 加载模型到内存
 * @param {string} name - 模型名称
 * @param {string} keepAlive - 保持活跃时间
 * @returns {Promise<boolean>} - 是否成功
 */
export async function loadModel(name, keepAlive = '5m') {
  // 验证并转换keepAlive参数格式
  if (keepAlive === 'permanent') {
    keepAlive = '-1s'; // 永久驻留使用-1s
  } else if (!/^(-1s|\d+[smhd]|0)$/.test(keepAlive)) {
    throw new Error('Invalid keep_alive format. Use -1s, number + (s/m/h/d) or 0');
  }

  const { post } = useApi()
  try {
    await post('/api/generate', {
      model: name,
      keep_alive: keepAlive,
      stream: false
    })
    return true
  } catch (error) {
    console.error('Load model error:', error)
    return false
  }
}

/**
 * 卸载模型
 * @param {string} name - 模型名称
 * @returns {Promise<boolean>} - 是否成功
 */
export async function unloadModel(name) {
  const { post } = useApi()
  try {
    await post('/api/generate', {
      model: name,
      keep_alive: '0s', // 使用正确的时间格式而非数字0
      stream: false
    })
    return true
  } catch (error) {
    console.error('Unload model error:', error)
    return false
  }
}

/**
 * 拉取模型
 * @param {string} name - 模型名称
 * @param {function} onProgress - 进度回调
 */
export async function pullModel(name, onProgress) {
  const { post } = useApi()
  const { processStream } = useStream()

  const response = await post('/api/pull', {
    name,
    stream: true
  })

  if (onProgress) {
    await processStream(response, onProgress)
  }
}

/**
 * 复制模型
 * @param {string} source - 源模型名称
 * @param {string} destination - 目标模型名称
 * @returns {Promise<boolean>} - 是否成功
 */
export async function copyModel(source, destination) {
  const { post } = useApi()
  try {
    await post('/api/copy', {
      source,
      destination
    })
    return true
  } catch (error) {
    console.error('Copy model error:', error)
    return false
  }
}

/**
 * 显示模型信息
 * @param {string} name - 模型名称
 * @returns {Promise<object>} - 模型信息
 */
export async function showModel(name) {
  const { post } = useApi()
  const response = await post('/api/show', { name })
  return await response.json()
}

/**
 * 检查 blob 是否存在
 * @param {string} digest - blob 摘要
 * @returns {Promise<boolean>} - 是否存在
 */
export async function checkBlob(digest) {
  const { head } = useApi()
  try {
    await head(`/api/blobs/${digest}`)
    return true
  } catch (error) {
    return false
  }
}

/**
 * 创建 blob
 * @param {string} digest - blob 摘要
 * @param {Blob} data - blob 数据
 * @returns {Promise<boolean>} - 是否成功
 */
export async function createBlob(digest, data) {
  const { request } = useApi()
  try {
    await request(`/api/blobs/${digest}`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    })
    return true
  } catch (error) {
    console.error('Create blob error:', error)
    return false
  }
}

/**
 * 获取版本信息
 * @returns {Promise<object>} - 版本信息
 */
export async function getVersion() {
  const { get } = useApi()
  return await get('/api/version')
}

/**
 * 生成嵌入向量
 * @param {string} model - 模型名称
 * @param {string} prompt - 提示文本
 * @returns {Promise<object>} - 嵌入向量
 */
export async function generateEmbeddings(model, prompt) {
  const { post } = useApi()
  const response = await post('/api/embeddings', {
    model,
    prompt
  })
  return await response.json()
}


