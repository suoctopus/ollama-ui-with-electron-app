import { ref, computed, onMounted } from 'vue'
import { useChatState } from '@/composables/core/useState'
import { useModels } from '@/composables/core/useState'
import { generateChat, listRunningModels } from '@/composables/common/useOllamaApi'
import { useSessionSettings } from '@/composables/useSessionSettings'
import { useI18n } from '@/composables/core/useI18n'
import { Search } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

export function useChatView() {
  const chatState = useChatState()
  const modelState = useModels()
  const { t } = useI18n()
  
  // Use composable for session settings
  const {
    localSettings,
    loadSessionSettings,
    saveSessionSettings,
    resetSessionSettings,
    resetParam,
    setupSessionWatcher,
  } = useSessionSettings()
  
  // Reactive state
  const generating = ref(false)
  const messageListRef = ref(null)
  const chatInputRef = ref(null)
  const abortController = ref(null)
  const isInputHidden = ref(false)
  const activeMessageId = ref(null)
  const showSettingsDialog = ref(false)
  const mounted = ref(false)
  const searchQuery = ref('')
  
  // Computed properties
  const currentMessages = computed(() => chatState.currentMessages.value)
  
  const outlineMessages = computed(() => {
    return currentMessages.value
  })
  
  // Matched message IDs based on search query
  const matchedMessageIds = computed(() => {
    if (!searchQuery.value.trim()) return []
    const query = searchQuery.value.toLowerCase()
    return currentMessages.value
      .filter(msg => msg.content.toLowerCase().includes(query))
      .map(msg => msg.id)
  })
  
  const currentRunningModel = computed(() => {
    if (modelState.runningModels.value && modelState.runningModels.value.length > 0) {
      return modelState.runningModels.value[0].name
    }
    return null
  })
  
  // Helper methods
  const extractBase64 = (dataUrl) => {
    return dataUrl.split(',')[1]
  }
  
  // Event handlers
  const handleScrollToMessage = (messageId) => {
    messageListRef.value?.scrollToMessage(messageId)
  }
  
  const handleRestoreMessage = (messageId) => {
    chatState.toggleMessageVisibility(messageId, false)
  }
  
  const handleHideMessage = (messageId) => {
    chatState.toggleMessageVisibility(messageId, true)
  }
  
  const handleNewChat = () => {
    chatState.createSession(currentRunningModel.value || '')
    chatInputRef.value?.reset()
  }
  
  const handleSendMessage = async ({ content, images, think }) => {
    if (!content || !currentRunningModel.value || generating.value) return
    
    const userMessage = content
    const imageBase64s = images.map(extractBase64)
    
    chatState.addMessage({
      role: 'user',
      content: userMessage,
      images: imageBase64s,
    })
    
    const assistantMessage = chatState.addMessage({
      role: 'assistant',
      content: '',
      thinking: '',
    })
    
    generating.value = true
    abortController.value = new AbortController()
    
    try {
      const messages = chatState.currentMessages.value
        .filter(m => m.id !== assistantMessage.id)
        .map(m => ({
          role: m.role,
          content: m.content,
          images: m.images || [],
        }))
      
      const options = {
        stream: true,
        think: think,
        temperature: localSettings.temperature,
        top_p: localSettings.top_p,
        top_k: localSettings.top_k,
      }
      
      if (localSettings.seed !== -1) {
        options.seed = localSettings.seed
      }
      // Always pass num_predict, even if -1 (no limit)
      options.num_predict = localSettings.num_predict
      
      if (localSettings.repeat_penalty !== 1.1) {
        options.repeat_penalty = localSettings.repeat_penalty
      }
      if (localSettings.num_ctx !== 2048) {
        options.num_ctx = localSettings.num_ctx
      }
      
      await generateChat(
        currentRunningModel.value,
        messages,
        options,
        (data) => {
          // Process all data packets including the final one with done=true
          if (data.message) {
            // For chat API, content is in data.message.content
            if (data.message.content) {
              chatState.updateMessage(assistantMessage.id, {
                content: (chatState.currentMessages.value.find(m => m.id === assistantMessage.id)?.content || '') + data.message.content,
              })
            }
            
            // For thinking models
            if (data.message.thinking) {
              chatState.updateMessage(assistantMessage.id, {
                thinking: (chatState.currentMessages.value.find(m => m.id === assistantMessage.id)?.thinking || '') + data.message.thinking,
              })
            }
          } else {
            // For non-chat APIs or direct content
            if (data.content) {
              chatState.updateMessage(assistantMessage.id, {
                content: (chatState.currentMessages.value.find(m => m.id === assistantMessage.id)?.content || '') + data.content,
              })
            }
            
            if (data.thinking) {
              chatState.updateMessage(assistantMessage.id, {
                thinking: (chatState.currentMessages.value.find(m => m.id === assistantMessage.id)?.thinking || '') + data.thinking,
              })
            }
          }
        }
      )
    } catch (error) {
      console.error('Generate error:', error)
      ElMessage.error('生成失败: ' + error.message)
      chatState.deleteMessage(assistantMessage.id)
    } finally {
      generating.value = false
      abortController.value = null
    }
  }
  
  const handleStopGeneration = () => {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
    generating.value = false
  }
  
  const handleDeleteMessage = (messageId) => {
    chatState.deleteMessage(messageId)
  }
  
  const handleRegenerateMessage = async (messageId) => {
    const messages = chatState.currentMessages.value
    const index = messages.findIndex(m => m.id === messageId)
    
    if (index > 0 && messages[index - 1].role === 'user') {
      const previousUserMessage = messages[index - 1]
      chatState.deleteMessage(messageId)
      chatInputRef.value?.setInput(previousUserMessage.content)
    }
  }
  
  const fetchRunningModels = async () => {
    try {
      const data = await listRunningModels()
      modelState.setRunningModels(data.models || [])
    } catch (error) {
      console.error('Failed to load running models:', error)
    }
  }
  
  const saveAndCloseSettings = () => {
    saveSessionSettings()
    showSettingsDialog.value = false
  }
  
  // Lifecycle
  onMounted(async () => {
    mounted.value = true
    await fetchRunningModels()
    setInterval(fetchRunningModels, 5000)
    
    if (chatState.currentSession.value) {
      loadSessionSettings()
    }
    
    // Setup session watcher
    setupSessionWatcher()
  })
  
  return {
    // State
    generating,
    messageListRef,
    chatInputRef,
    isInputHidden,
    activeMessageId,
    showSettingsDialog,
    mounted,
    searchQuery,
    localSettings,
    
    // Computed
    currentMessages,
    outlineMessages,
    matchedMessageIds,
    currentRunningModel,
    
    // Methods
    handleScrollToMessage,
    handleRestoreMessage,
    handleHideMessage,
    handleNewChat,
    handleSendMessage,
    handleStopGeneration,
    handleDeleteMessage,
    handleRegenerateMessage,
    saveAndCloseSettings,
    resetParam,
    resetSessionSettings,
    
    // Utils
    t,
    
    // Icons
    Search
  }
}
