<template>
  <div class="messages-container" ref="messagesContainer">
    <div v-if="messages.length === 0" class="empty-state">
      <MessageSquare :size="64" color="#ccc" />
      <p v-if="!currentRunningModel">{{ $t('chat.noRunningModel') }}</p>
      <p v-else>{{ $t('chat.noModel') }}</p>
    </div>
    
    <div class="messages-center">
      <MessageCard
        v-for="message in messages"
        v-show="!message.hidden"
        :key="message.id"
        :message="message"
        :id="'msg-' + message.id"
        class="message-card"
        :class="{ 'is-search-matched': isMessageMatched(message.id) }"
        @delete="$emit('delete', message.id)"
        @regenerate="$emit('regenerate', message.id)"
        @hide="$emit('hide', message.id)"
      />
    </div>
    
    <div v-if="generating" class="generating-indicator">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>{{ $t('chat.generating') }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { MessageSquare } from 'lucide-vue-next'
import { Loading } from '@element-plus/icons-vue'
import MessageCard from '@/components/MessageCard.vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  currentRunningModel: {
    type: String,
    default: null
  },
  generating: {
    type: Boolean,
    default: false
  },
  matchedMessageIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['delete', 'regenerate', 'hide', 'update:activeMessageId'])

const messagesContainer = ref(null)
const observer = ref(null)

const isMessageMatched = (msgId) => {
  return props.matchedMessageIds.includes(msgId)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const scrollToMessage = (messageId) => {
  const element = document.getElementById('msg-' + messageId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const setupIntersectionObserver = () => {
  if (observer.value) observer.value.disconnect()
  
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('msg-', '')
        emit('update:activeMessageId', id)
      }
    })
  }, {
    root: messagesContainer.value,
    threshold: 0.5
  })
  
  nextTick(() => {
    const cards = document.querySelectorAll('.message-card')
    cards.forEach(card => observer.value.observe(card))
  })
}

watch(() => props.messages.length, () => {
  setupIntersectionObserver()
  scrollToBottom()
})

onMounted(() => {
  setupIntersectionObserver()
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})

defineExpose({
  scrollToBottom,
  scrollToMessage
})
</script>

<style scoped>
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 180px; /* 增加底部距离，防止输入框遮挡 */
}

.messages-center {
  max-width: 800px;
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.empty-state p {
  margin-top: 16px;
  font-size: 16px;
}

.generating-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  color: #409eff;
  font-size: 14px;
}

:deep(.is-search-matched) {
  box-shadow: 0 0 0 2px #faad14;
  border-radius: 8px;
}
</style>
