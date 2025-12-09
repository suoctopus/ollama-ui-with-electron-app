import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MessageCircle } from 'lucide-vue-next'
import MessageCard from '@/components/MessageCard.vue'
import { useI18n } from '@/composables/core/useI18n'

export function useMessageList(props, emit) {
  const { t } = useI18n()
  
  // Refs
  const messageListRef = ref(null)
  
  // Computed
  const visibleMessages = computed(() => {
    return props.messages.filter(msg => !msg.hidden)
  })
  
  // Methods
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
  
  // Lifecycle
  onMounted(() => {
    // Initial scroll to bottom
    scrollToBottom()
  })
  
  onUnmounted(() => {
    // Clean up if needed
  })
  
  // Return everything needed by the template
  return {
    // Refs
    messageListRef,
    
    // Computed
    visibleMessages,
    
    // Methods
    scrollToBottom,
    scrollToMessage,
    
    // Components
    MessageCard,
    
    // Icons
    MessageCircle,
    
    // Utils
    t
  }
}
