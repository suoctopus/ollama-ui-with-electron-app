<template>
  <Layout>
    <div class="chat-view">
      <!-- Global Search Box Teleported to Layout Header -->
      <Teleport to="#global-search" v-if="mounted">
        <el-input
          v-model="searchQuery"
          :placeholder="$t('chat.searchMessages')"
          :prefix-icon="Search"
          clearable
          style="width: 150px"
          size="small"
        />
      </Teleport>
      
      <!-- Main Content Area -->
      <div class="chat-main">
        <!-- Left Outline Panel -->
        <ChatOutline
          :messages="outlineMessages"
          :active-message-id="activeMessageId"
          :is-input-hidden="isInputHidden"
          :matched-message-ids="matchedMessageIds"
          @restore-input="isInputHidden = false"
          @scroll-to-message="handleScrollToMessage"
          @restore-message="handleRestoreMessage"
        />

        <!-- Messages Area -->
        <div class="messages-wrapper">
          <!-- Toolbar above messages -->
          <ChatToolbar
            :search-query="searchQuery"
            :matched-message-ids="matchedMessageIds"
            :current-running-model="currentRunningModel"
            @new-chat="handleNewChat"
          />

          <MessageList
            ref="messageListRef"
            :messages="currentMessages"
            :current-running-model="currentRunningModel"
            :generating="generating"
            :matched-message-ids="matchedMessageIds"
            @delete="handleDeleteMessage"
            @regenerate="handleRegenerateMessage"
            @hide="handleHideMessage"
            @update:active-message-id="activeMessageId = $event"
          />

          <!-- Floating Input Area -->
          <ChatInput
            ref="chatInputRef"
            :generating="generating"
            :current-running-model="currentRunningModel"
            @send="handleSendMessage"
            @stop="handleStopGeneration"
            @open-settings="showSettingsDialog = true"
          />
        </div>
      </div>
      
      <!-- Settings Modal Dialog (抽取为独立组件) -->
      <ChatSettingsDialog
        v-model="showSettingsDialog"
        :settings="localSettings"
        @update:settings="Object.assign(localSettings, $event)"
        @reset-param="resetParam"
        @reset-all="resetSessionSettings"
        @confirm="saveAndCloseSettings"
      />
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChatStore } from '@/store/chat'
import { useModelStore } from '@/store/models'
import { generateChat, listRunningModels } from '@/api/ollama'
import Layout from '@/components/Layout.vue'
import ChatOutline from '@/components/chat/ChatOutline.vue'
import ChatToolbar from '@/components/chat/ChatToolbar.vue'
import MessageList from '@/components/chat/MessageList.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ChatSettingsDialog from '@/components/chat/ChatSettingsDialog.vue'
import { useSessionSettings } from '@/composables/useSessionSettings'
import { Search } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const chatStore = useChatStore()
const modelStore = useModelStore()

// 使用 composable 管理会话设置
const {
  localSettings,
  loadSessionSettings,
  saveSessionSettings,
  resetSessionSettings,
  resetParam,
  setupSessionWatcher,
} = useSessionSettings()

const generating = ref(false)
const messageListRef = ref(null)
const chatInputRef = ref(null)
const abortController = ref(null)
const isInputHidden = ref(false)
const activeMessageId = ref(null)
const showSettingsDialog = ref(false)
const mounted = ref(false)
const searchQuery = ref('')

const currentMessages = computed(() => chatStore.currentMessages)

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

const handleScrollToMessage = (messageId) => {
  messageListRef.value?.scrollToMessage(messageId)
}

const handleRestoreMessage = (messageId) => {
  chatStore.toggleMessageVisibility(messageId, false)
}

const handleHideMessage = (messageId) => {
  chatStore.toggleMessageVisibility(messageId, true)
}

const currentRunningModel = computed(() => {
  if (modelStore.runningModels && modelStore.runningModels.length > 0) {
    return modelStore.runningModels[0].name
  }
  return null
})

const extractBase64 = (dataUrl) => {
  return dataUrl.split(',')[1]
}

const handleNewChat = () => {
  chatStore.createSession(currentRunningModel.value || '')
  chatInputRef.value?.reset()
}

const handleSendMessage = async ({ content, images, think }) => {
  if (!content || !currentRunningModel.value || generating.value) return
  
  const userMessage = content
  const imageBase64s = images.map(extractBase64)
  
  chatStore.addMessage({
    role: 'user',
    content: userMessage,
    images: imageBase64s,
  })
  
  const assistantMessage = chatStore.addMessage({
    role: 'assistant',
    content: '',
    thinking: '',
  })
  
  generating.value = true
  abortController.value = new AbortController()
  
  try {
    const messages = chatStore.currentMessages
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
    if (localSettings.num_predict > 0) {
      options.num_predict = localSettings.num_predict
    }
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
        if (data.content) {
          chatStore.updateMessage(assistantMessage.id, {
            content: (assistantMessage.content || '') + data.content,
          })
        }
        if (data.thinking) {
          chatStore.updateMessage(assistantMessage.id, {
            thinking: (assistantMessage.thinking || '') + data.thinking,
          })
        }
      }
    )
  } catch (error) {
    console.error('Generate error:', error)
    ElMessage.error('生成失败: ' + error.message)
    chatStore.deleteMessage(assistantMessage.id)
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
  chatStore.deleteMessage(messageId)
}

const handleRegenerateMessage = async (messageId) => {
  const messages = chatStore.currentMessages
  const index = messages.findIndex(m => m.id === messageId)
  
  if (index > 0 && messages[index - 1].role === 'user') {
    const previousUserMessage = messages[index - 1]
    chatStore.deleteMessage(messageId)
    chatInputRef.value?.setInput(previousUserMessage.content)
  }
}

const fetchRunningModels = async () => {
  try {
    const data = await listRunningModels()
    modelStore.setRunningModels(data.models || [])
  } catch (error) {
    console.error('Failed to load running models:', error)
  }
}

const saveAndCloseSettings = () => {
  saveSessionSettings()
  showSettingsDialog.value = false
}

onMounted(async () => {
  mounted.value = true
  await fetchRunningModels()
  setInterval(fetchRunningModels, 5000)
  
  if (chatStore.currentSession) {
    loadSessionSettings()
  }
  
  // 设置会话切换监听
  setupSessionWatcher()
})
</script>

<style scoped>
.chat-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.messages-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
</style>
