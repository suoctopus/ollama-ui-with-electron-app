import { useSettingsStore } from '@/store/settings'

/**
 * Ollama API 客户端
 * 实现所有 Ollama API 端点
 */

// 获取基础 URL
const getBaseUrl = () => {
    const settings = useSettingsStore()
    return settings.ollamaUrl
}

// 通用请求方法
const request = async (endpoint, options = {}) => {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}${endpoint}`

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        })

        if (!response.ok && response.status !== 404) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response
    } catch (error) {
        console.error('API request failed:', error)
        throw error
    }
}

/**
 * 生成对话补全 (Chat Completion)
 * POST /api/chat
 */
export const generateChat = async (model, messages, options = {}, onStream = null) => {
    const {
        stream = true,
        format,
        tools,
        think,
        keep_alive,
        ...otherOptions
    } = options

    const body = {
        model,
        messages,
        stream,
    }

    if (format) body.format = format
    if (tools) body.tools = tools
    if (think !== undefined) body.think = think
    if (keep_alive) body.keep_alive = keep_alive
    if (Object.keys(otherOptions).length > 0) {
        body.options = otherOptions
    }

    const response = await request('/api/chat', {
        method: 'POST',
        body: JSON.stringify(body),
    })

    if (stream && onStream) {
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
                        // Always process the data first
                        // 提取 thinking 和 content 字段
                        if (data.message) {
                            const streamData = {
                                ...data,
                                content: data.message.content || '',
                                thinking: data.message.thinking || '',
                            }
                            onStream(streamData)
                        } else {
                            onStream(data)
                        }
                        // Check if the stream should be terminated based on done field
                        // But we still process the content in this final packet
                        if (data.done === true) {
                            return
                        }
                    } catch (e) {
                        console.error('Failed to parse chunk:', e)
                    }
                }
            }
        } finally {
            reader.releaseLock()
        }
    } else {
        return await response.json()
    }
}

/**
 * 生成补全 (Generate Completion)
 * POST /api/generate
 */
export const generateCompletion = async (model, prompt, options = {}, onStream = null) => {
    const {
        stream = true,
        suffix,
        images,
        think,
        format,
        system,
        template,
        raw,
        keep_alive,
        context,
        ...otherOptions
    } = options

    const body = {
        model,
        prompt,
        stream,
    }

    if (suffix) body.suffix = suffix
    if (images) body.images = images
    if (think !== undefined) body.think = think
    if (format) body.format = format
    if (system) body.system = system
    if (template) body.template = template
    if (raw !== undefined) body.raw = raw
    if (keep_alive) body.keep_alive = keep_alive
    if (context) body.context = context
    if (Object.keys(otherOptions).length > 0) {
        body.options = otherOptions
    }

    const response = await request('/api/generate', {
        method: 'POST',
        body: JSON.stringify(body),
    })

    if (stream && onStream) {
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
                        // Check if the stream should be terminated based on done field
                        if (data.done === true) {
                            onStream(data)
                            return
                        }
                        onStream(data)
                    } catch (e) {
                        console.error('Failed to parse chunk:', e)
                    }
                }
            }
        } finally {
            reader.releaseLock()
        }
    } else {
        return await response.json()
    }
}

/**
 * 列出本地模型 (List Local Models)
 * GET /api/tags
 */
export const listModels = async () => {
    const response = await request('/api/tags', {
        method: 'GET',
    })
    return await response.json()
}

/**
 * 显示模型信息 (Show Model Information)
 * POST /api/show
 */
export const showModel = async (name, verbose = false) => {
    const response = await request('/api/show', {
        method: 'POST',
        body: JSON.stringify({ model: name, verbose }),
    })
    return await response.json()
}

/**
 * 复制模型 (Copy Model)
 * POST /api/copy
 */
export const copyModel = async (source, destination) => {
    const response = await request('/api/copy', {
        method: 'POST',
        body: JSON.stringify({ source, destination }),
    })
    return response.ok
}

/**
 * 删除模型 (Delete Model)
 * DELETE /api/delete
 */
export const deleteModel = async (name) => {
    const response = await request('/api/delete', {
        method: 'DELETE',
        body: JSON.stringify({ model: name }),
    })
    return response.ok
}

/**
 * 拉取模型 (Pull Model)
 * POST /api/pull
 */
export const pullModel = async (name, insecure = false, onStream = null) => {
    const body = {
        model: name,
        stream: !!onStream,
    }

    if (insecure) body.insecure = insecure

    const response = await request('/api/pull', {
        method: 'POST',
        body: JSON.stringify(body),
    })

    if (onStream) {
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
                        // Check if the stream should be terminated based on done field
                        if (data.done === true) {
                            onStream(data)
                            return
                        }
                        onStream(data)
                    } catch (e) {
                        console.error('Failed to parse chunk:', e)
                    }
                }
            }
        } finally {
            reader.releaseLock()
        }
    } else {
        return await response.json()
    }
}

/**
 * 推送模型 (Push Model)
 * POST /api/push
 */
export const pushModel = async (name, insecure = false, onStream = null) => {
    const body = {
        model: name,
        stream: !!onStream,
    }

    if (insecure) body.insecure = insecure

    const response = await request('/api/push', {
        method: 'POST',
        body: JSON.stringify(body),
    })

    if (onStream) {
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
                        // Check if the stream should be terminated based on done field
                        if (data.done === true) {
                            onStream(data)
                            return
                        }
                        onStream(data)
                    } catch (e) {
                        console.error('Failed to parse chunk:', e)
                    }
                }
            }
        } finally {
            reader.releaseLock()
        }
    } else {
        return await response.json()
    }
}

/**
 * 生成嵌入 (Generate Embeddings)
 * POST /api/embed
 */
export const generateEmbeddings = async (model, input, options = {}) => {
    const { truncate, keep_alive, ...otherOptions } = options

    const body = {
        model,
        input,
    }

    if (truncate !== undefined) body.truncate = truncate
    if (keep_alive) body.keep_alive = keep_alive
    if (Object.keys(otherOptions).length > 0) {
        body.options = otherOptions
    }

    const response = await request('/api/embed', {
        method: 'POST',
        body: JSON.stringify(body),
    })
    return await response.json()
}

/**
 * 生成嵌入 (已弃用) (Generate Embedding - Deprecated)
 * POST /api/embeddings
 */
export const generateEmbedding = async (model, prompt, options = {}) => {
    const { keep_alive, ...otherOptions } = options

    const body = {
        model,
        prompt,
    }

    if (keep_alive) body.keep_alive = keep_alive
    if (Object.keys(otherOptions).length > 0) {
        body.options = otherOptions
    }

    const response = await request('/api/embeddings', {
        method: 'POST',
        body: JSON.stringify(body),
    })
    return await response.json()
}

/**
 * 列出正在运行的模型 (List Running Models)
 * GET /api/ps
 */
export const listRunningModels = async () => {
    const response = await request('/api/ps', {
        method: 'GET',
    })
    return await response.json()
}

/**
 * 检查 Blob 是否存在 (Check if Blob Exists)
 * HEAD /api/blobs/:digest
 */
export const checkBlobExists = async (digest) => {
    const response = await request(`/api/blobs/${digest}`, {
        method: 'HEAD',
    })
    return response.ok
}

/**
 * 推送 Blob (Push Blob)
 * POST /api/blobs/:digest
 */
export const pushBlob = async (digest, file) => {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/blobs/${digest}`

    const response = await fetch(url, {
        method: 'POST',
        body: file,
    })

    return response.ok
}

/**
 * 创建模型 (Create Model)
 * POST /api/create
 */
export const createModel = async (name, modelfile, path, quantize, onStream = null) => {
    const body = {
        model: name,
        stream: !!onStream,
    }

    if (modelfile) body.modelfile = modelfile
    if (path) body.path = path
    if (quantize) body.quantize = quantize

    const response = await request('/api/create', {
        method: 'POST',
        body: JSON.stringify(body),
    })

    if (onStream) {
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
                        // Check if the stream should be terminated based on done field
                        if (data.done === true) {
                            onStream(data)
                            return
                        }
                        onStream(data)
                    } catch (e) {
                        console.error('Failed to parse chunk:', e)
                    }
                }
            }
        } finally {
            reader.releaseLock()
        }
    } else {
        return await response.json()
    }
}

/**
 * 获取 Ollama 版本 (Get Ollama Version)
 * GET /api/version
 */
export const getVersion = async () => {
    const response = await request('/api/version', {
        method: 'GET',
    })
    return await response.json()
}

/**
 * 测试连接 (Test Connection)
 */
export const testConnection = async () => {
    try {
        await getVersion()
        return true
    } catch (error) {
        return false
    }
}

/**
 * 加载模型到内存 (Load Model)
 * 通过发送一个空的 generate 请求并设置 keep_alive 来预加载模型
 */
export const loadModel = async (modelName, keepAlive = '5m') => {
    try {
        await request('/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                model: modelName,
                prompt: '',
                keep_alive: keepAlive,
                stream: false,
            }),
        })
        return true
    } catch (error) {
        console.error('Load model error:', error)
        return false
    }
}

/**
 * 卸载模型 (Unload Model)
 * 通过设置 keep_alive 为 0 立即卸载模型
 */
export const unloadModel = async (modelName) => {
    try {
        await request('/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                model: modelName,
                prompt: '',
                keep_alive: 0,
                stream: false,
            }),
        })
        return true
    } catch (error) {
        console.error('Unload model error:', error)
        return false
    }
}
