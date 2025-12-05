<template>
  <div class="message-list" ref="messageListRef">
    <div 
      v-for="(message, index) in visibleMessages" 
      :key="message.id"
      :id="'message-' + message.id"
      class="message-wrapper"
    >
      <MessageCard 
        :message="message"
        :message-index="index + 1"
        @delete="$emit('delete', message.id)"
        @regenerate="$emit('regenerate', message.id)"
        @hide="$emit('hide', message.id)"
        @update:active-message-id="$emit('update:active-message-id', $event)"
      />
    </div>
    
    <div v-if="visibleMessages.length === 0" class="empty-state">
      <MessageCircle :size="48" class="empty-icon" />
      <p>{{ $t('chat.noMessages') }}</p>
      <p class="empty-subtext">{{ $t('chat.startConversation') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MessageCircle } from 'lucide-vue-next'
import MessageCard from '@/components/MessageCard.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  generating: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete', 'regenerate', 'hide', 'update:active-message-id'])

const messageListRef = ref(null)

const visibleMessages = computed(() => {
  return props.messages.filter(msg => !msg.hidden)
})

const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

const scrollToMessage = (messageId) => {
  const element = document.getElementById('message-' + messageId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // Highlight the message temporarily
    element.classList.add('highlight')
    setTimeout(() => {
      element.classList.remove('highlight')
    }, 2000)
  }
}

defineExpose({
  scrollToBottom,
  scrollToMessage
})

onMounted(() => {
  // Initial scroll to bottom
  scrollToBottom()
})

onUnmounted(() => {
  // Clean up if needed
})
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  padding-bottom: 120px;
}

.message-wrapper {
  transition: background-color 0.3s;
}

.message-wrapper.highlight {
  background-color: #fff9c4;
  border-radius: 8px;
  padding: 8px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  text-align: center;
  padding: 40px;
}

.empty-icon {
  margin-bottom: 16px;
  color: #ccc;
}

.empty-subtext {
  font-size: 14px;
  color: #bbb;
  margin-top: 8px;
}
</style>
