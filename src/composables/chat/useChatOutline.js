import { ref, watch, nextTick } from 'vue'
import { User, Bot, Eye } from 'lucide-vue-next'
import { useI18n } from '@/composables/core/useI18n'

export function useChatOutline(props, emit) {
  const { t } = useI18n()
  
  const outlineList = ref(null)
  
  const isMessageMatched = (msgId) => {
    return props.matchedMessageIds.includes(msgId)
  }
  
  const handleRestoreInput = () => {
    emit('restore-input')
  }
  
  const handleScrollToMessage = (msgId) => {
    emit('scroll-to-message', msgId)
  }
  
  const handleRestoreMessage = (msgId) => {
    emit('restore-message', msgId)
  }
  
  // Watch for active message changes and scroll to it in outline
  watch(() => props.activeMessageId, (newId) => {
    if (newId) {
      nextTick(() => {
        const outlineItem = document.getElementById('outline-' + newId)
        if (outlineItem) {
          outlineItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      })
    }
  })
  
  return {
    // State
    outlineList,
    
    // Methods
    isMessageMatched,
    handleRestoreInput,
    handleScrollToMessage,
    handleRestoreMessage,
    
    // Utils
    t,
    
    // Icons
    User,
    Bot,
    Eye
  }
}
