import { AlertCircle, Cpu, Plus as PlusIcon } from 'lucide-vue-next'
import { useI18n } from '@/composables/core/useI18n'

export function useChatToolbar(props, emit) {
  const { t } = useI18n()
  
  const handleNewChat = () => {
    emit('new-chat')
  }
  
  return {
    // Methods
    handleNewChat,
    
    // Utils
    t,
    
    // Icons
    AlertCircle,
    Cpu,
    PlusIcon
  }
}
