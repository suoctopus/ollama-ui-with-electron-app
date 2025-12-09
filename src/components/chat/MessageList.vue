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
      <p>{{ t('chat.noMessages') }}</p>
      <p class="empty-subtext">{{ t('chat.startConversation') }}</p>
    </div>
  </div>
</template>

<script>
import { useMessageList } from '@/composables/chat/useMessageList'
import MessageCard from '@/components/MessageCard.vue'
import { MessageCircle } from 'lucide-vue-next'

export default {
  components: {
    MessageCard,
    MessageCircle
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    generating: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete', 'regenerate', 'hide', 'update:active-message-id'],
  setup(props, { emit, expose }) {
    const composable = useMessageList(props, emit)
    
    // Expose methods for parent components
    expose({
      scrollToBottom: composable.scrollToBottom,
      scrollToMessage: composable.scrollToMessage
    })
    
    return composable
  }
}
</script>