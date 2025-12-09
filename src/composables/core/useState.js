import { ref, computed, watch } from 'vue'
import { nanoid } from 'nanoid'

// ============================================================================
// Chat State Management
// ============================================================================

// 聊天状态
const sessions = ref([])
const categories = ref([])
const currentSessionId = ref(null)
const generating = ref(false)

// 计算属性
const currentSession = computed(() => {
  return sessions.value.find(s => s.id === currentSessionId.value)
})

const currentMessages = computed(() => {
  return currentSession.value?.messages || []
})

// 持久化
const saveChatToStorage = () => {
  try {
    const data = {
      sessions: sessions.value,
      categories: categories.value,
      currentSessionId: currentSessionId.value,
    }
    localStorage.setItem('chat-sessions', JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save chat to storage:', error)
  }
}

const loadChatFromStorage = () => {
  try {
    const saved = localStorage.getItem('chat-sessions')
    if (saved) {
      const data = JSON.parse(saved)
      sessions.value = data.sessions || []
      categories.value = data.categories || []
      currentSessionId.value = data.currentSessionId
    }
  } catch (error) {
    console.error('Failed to load chat from storage:', error)
    sessions.value = []
    categories.value = []
    currentSessionId.value = null
  }

  // Create default session if none exists
  if (sessions.value.length === 0) {
    createSession()
  }
}

// 监听变化自动保存
watch([sessions, categories, currentSessionId], () => {
  saveChatToStorage()
}, { deep: true })

// 导出聊天状态管理
export function useChatState() {
  const addMessage = (message) => {
    if (!currentSession.value) {
      createSession()
    }
    
    const newMessage = {
      id: nanoid(),
      role: message.role,
      content: message.content || '',
      thinking: message.thinking || '',
      images: message.images || [],
      createdAt: Date.now(),
      hidden: false,
      ...message
    }
    
    currentSession.value.messages.push(newMessage)
    return newMessage
  }
  
  const updateMessage = (id, updates) => {
    const session = currentSession.value
    if (!session) return
    
    const message = session.messages.find(m => m.id === id)
    if (message) {
      Object.assign(message, updates)
    }
  }
  
  const deleteMessage = (id) => {
    const session = currentSession.value
    if (!session) return
    
    const index = session.messages.findIndex(m => m.id === id)
    if (index !== -1) {
      session.messages.splice(index, 1)
    }
  }
  
  const toggleMessageVisibility = (id, hidden) => {
    const session = currentSession.value
    if (!session) return
    
    const message = session.messages.find(m => m.id === id)
    if (message) {
      message.hidden = hidden
    }
  }
  
  const createSession = (model = '') => {
    const newSession = {
      id: nanoid(),
      title: 'New Chat',
      model: model,
      category: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      settings: {}
    }
    
    sessions.value.unshift(newSession)
    currentSessionId.value = newSession.id
    return newSession
  }
  
  const deleteSession = (id) => {
    sessions.value = sessions.value.filter(s => s.id !== id)
    if (currentSessionId.value === id) {
      currentSessionId.value = sessions.value[0]?.id || null
    }
  }
  
  const updateSessionSettings = (id, settings) => {
    const session = sessions.value.find(s => s.id === id)
    if (session) {
      session.settings = { ...session.settings, ...settings }
    }
  }
  
  const setCurrentSession = (id) => {
    currentSessionId.value = id
  }
  
  const addCategory = (name) => {
    if (!categories.value.includes(name)) {
      categories.value.push(name)
    }
  }
  
  const renameSession = (id, newTitle) => {
    const session = sessions.value.find(s => s.id === id)
    if (session) {
      session.title = newTitle
    }
  }
  
  const setSessionCategory = (id, category) => {
    const session = sessions.value.find(s => s.id === id)
    if (session) {
      session.category = category
    }
  }
  
  const deleteCategory = (name) => {
    categories.value = categories.value.filter(c => c !== name)
    // Clear category from sessions
    sessions.value.forEach(s => {
      if (s.category === name) {
        s.category = ''
      }
    })
  }
  
  return {
    // 状态
    sessions,
    categories,
    currentSessionId,
    generating,
    currentSession,
    currentMessages,
    
    // 方法
    addMessage,
    updateMessage,
    deleteMessage,
    toggleMessageVisibility,
    createSession,
    deleteSession,
    updateSessionSettings,
    setCurrentSession,
    addCategory,
    renameSession,
    setSessionCategory,
    deleteCategory,
    loadFromStorage: loadChatFromStorage,
    saveToStorage: saveChatToStorage
  }
}

// ============================================================================
// Settings State Management
// ============================================================================

const settings = ref({
  ollamaUrl: 'http://localhost:11434',
  language: 'zh-CN',
  theme: 'auto',
  fontSize: 14,

  // Basic generation settings
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxTokens: 2048,

  // Sampling parameters
  seed: -1,
  numPredict: -1,
  minP: 0.0,
  typicalP: 1.0,

  // Repetition penalty parameters
  repeatLastN: 64,
  repeatPenalty: 1.1,
  presencePenalty: 0.0,
  frequencyPenalty: 0.0,

  // Context parameters
  numCtx: 2048,
  numKeep: 5,

  // Hardware parameters
  numGpu: -1,
  numThread: 0,

  // Other parameters
  keepAlive: '5m',
  systemPrompt: '',
  stopSequences: [],
})

const saveSettingsToStorage = () => {
  try {
    localStorage.setItem('settings', JSON.stringify(settings.value))
  } catch (error) {
    console.error('Failed to save settings to storage:', error)
  }
}

const loadSettingsFromStorage = () => {
  try {
    const saved = localStorage.getItem('settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Merge with defaults to handle new fields
      Object.keys(settings.value).forEach(key => {
        if (parsed[key] !== undefined) {
          settings.value[key] = parsed[key]
        }
      })
    }
  } catch (error) {
    console.error('Failed to load settings from storage:', error)
  }
}

// 监听设置变化自动保存
watch(settings, () => {
  saveSettingsToStorage()
}, { deep: true })

export function useSettings() {
  const setOllamaUrl = (url) => {
    settings.value.ollamaUrl = url
  }
  
  const setLanguage = (lang) => {
    settings.value.language = lang
  }
  
  const setTheme = (theme) => {
    settings.value.theme = theme
  }
  
  const setFontSize = (size) => {
    settings.value.fontSize = size
  }
  
  const updateAdvancedSettings = (newSettings) => {
    Object.assign(settings.value, newSettings)
  }
  
  const reset = () => {
    settings.value = {
      ollamaUrl: 'http://localhost:11434',
      language: 'zh-CN',
      theme: 'auto',
      fontSize: 14,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxTokens: 2048,
      seed: -1,
      numPredict: -1,
      minP: 0.0,
      typicalP: 1.0,
      repeatLastN: 64,
      repeatPenalty: 1.1,
      presencePenalty: 0.0,
      frequencyPenalty: 0.0,
      numCtx: 2048,
      numKeep: 5,
      numGpu: -1,
      numThread: 0,
      keepAlive: '5m',
      systemPrompt: '',
      stopSequences: [],
    }
  }
  
  const resetKey = (key) => {
    const defaults = {
      ollamaUrl: 'http://localhost:11434',
      language: 'zh-CN',
      theme: 'auto',
      fontSize: 14,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxTokens: 2048,
      seed: -1,
      numPredict: -1,
      minP: 0.0,
      typicalP: 1.0,
      repeatLastN: 64,
      repeatPenalty: 1.1,
      presencePenalty: 0.0,
      frequencyPenalty: 0.0,
      numCtx: 2048,
      numKeep: 5,
      numGpu: -1,
      numThread: 0,
      keepAlive: '5m',
      systemPrompt: '',
      stopSequences: [],
    }
    if (key in defaults) {
      settings.value[key] = defaults[key]
    }
  }
  
  return {
    settings,
    setOllamaUrl,
    setLanguage,
    setTheme,
    setFontSize,
    updateAdvancedSettings,
    reset,
    resetKey,
    loadFromStorage: loadSettingsFromStorage,
    saveToStorage: saveSettingsToStorage
  }
}

// ============================================================================
// Models State Management
// ============================================================================

const models = ref([])
const runningModels = ref([])
const modelKeepAliveSettings = ref({})
const loadingModels = ref([])
const loading = ref(false)
const pulling = ref(false)
const pullProgress = ref(null)

const modelNames = computed(() => models.value.map(m => m.name))

export function useModels() {
  const isModelRunning = (modelName) => {
    return runningModels.value.some(m => m.name === modelName)
  }
  
  const getModelKeepAlive = (modelName) => {
    return modelKeepAliveSettings.value[modelName] || '5m'
  }
  
  const isModelLoading = (modelName) => {
    return loadingModels.value.includes(modelName)
  }
  
  const setModels = (newModels) => {
    models.value = newModels
  }
  
  const addModel = (model) => {
    const index = models.value.findIndex(m => m.name === model.name)
    if (index >= 0) {
      models.value[index] = model
    } else {
      models.value.push(model)
    }
  }
  
  const removeModel = (name) => {
    models.value = models.value.filter(m => m.name !== name)
  }
  
  const setLoading = (isLoading) => {
    loading.value = isLoading
  }
  
  const setPulling = (isPulling) => {
    pulling.value = isPulling
  }
  
  const setPullProgress = (progress) => {
    pullProgress.value = progress
  }
  
  const setRunningModels = (newModels) => {
    runningModels.value = newModels || []
  }
  
  const updateModelRunningStatus = (modelName, isRunning) => {
    if (isRunning) {
      if (!runningModels.value.some(m => m.name === modelName)) {
        runningModels.value.push({ name: modelName })
      }
    } else {
      runningModels.value = runningModels.value.filter(m => m.name !== modelName)
    }
  }
  
  const setModelKeepAlive = (modelName, keepAlive) => {
    modelKeepAliveSettings.value[modelName] = keepAlive
  }
  
  const setModelLoading = (modelName, isLoading) => {
    if (isLoading) {
      if (!loadingModels.value.includes(modelName)) {
        loadingModels.value.push(modelName)
      }
    } else {
      loadingModels.value = loadingModels.value.filter(name => name !== modelName)
    }
  }
  
  return {
    // 状态
    models,
    runningModels,
    modelKeepAliveSettings,
    loadingModels,
    loading,
    pulling,
    pullProgress,
    modelNames,
    
    // 方法
    isModelRunning,
    getModelKeepAlive,
    isModelLoading,
    setModels,
    addModel,
    removeModel,
    setLoading,
    setPulling,
    setPullProgress,
    setRunningModels,
    updateModelRunningStatus,
    setModelKeepAlive,
    setModelLoading
  }
}
