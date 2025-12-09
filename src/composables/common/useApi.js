import { ref } from 'vue'

/**
 * API 请求封装 Composable
 * 提供统一的 API 请求接口和状态管理
 * 
 * 需求：2.1.1 - API 调用应在 composables 中实现
 */
export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * 获取基础 URL
   * 注意：这里需要从设置中获取，但为了避免循环依赖，
   * 我们将在实际使用时传入或从 localStorage 读取
   */
  const getBaseUrl = () => {
    // 从 localStorage 读取设置
    const settings = localStorage.getItem('settings')
    if (settings) {
      try {
        const parsed = JSON.parse(settings)
        return parsed.ollamaUrl || 'http://localhost:11434'
      } catch (e) {
        console.error('Failed to parse settings:', e)
      }
    }
    return 'http://localhost:11434'
  }

  /**
   * 通用请求方法
   * @param {string} endpoint - API 端点
   * @param {object} options - fetch 选项
   * @returns {Promise<Response>} - fetch 响应
   */
  const request = async (endpoint, options = {}) => {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}${endpoint}`
    
    loading.value = true
    error.value = null

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
    } catch (err) {
      error.value = err
      console.error('API request failed:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * GET 请求
   * @param {string} endpoint - API 端点
   * @returns {Promise<any>} - JSON 响应
   */
  const get = async (endpoint) => {
    const response = await request(endpoint, {
      method: 'GET',
    })
    return await response.json()
  }

  /**
   * POST 请求
   * @param {string} endpoint - API 端点
   * @param {object} data - 请求体数据
   * @returns {Promise<Response>} - fetch 响应
   */
  const post = async (endpoint, data) => {
    return await request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE 请求
   * @param {string} endpoint - API 端点
   * @param {object} data - 请求体数据
   * @returns {Promise<Response>} - fetch 响应
   */
  const del = async (endpoint, data) => {
    return await request(endpoint, {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  }

  /**
   * HEAD 请求
   * @param {string} endpoint - API 端点
   * @returns {Promise<Response>} - fetch 响应
   */
  const head = async (endpoint) => {
    return await request(endpoint, {
      method: 'HEAD',
    })
  }

  return {
    loading,
    error,
    request,
    get,
    post,
    del,
    head,
    getBaseUrl,
  }
}
