import { ref } from 'vue'
import { Plus as PlusIcon, Send, Square, X, Settings2 } from 'lucide-vue-next'
import { useI18n } from '@/composables/core/useI18n'

/**
 * ChatInput composable - handles chat input logic
 * @param {Object} props - Component props
 * @param {Function} emit - Component emit function
 */
export function useChatInput(props, emit) {
  const { t } = useI18n()
  
  // Reactive state
  const inputContent = ref('')
  const images = ref([])
  const enableThink = ref(false)
  const fileInput = ref(null)
  
  // Methods
  const triggerImageUpload = () => {
    fileInput.value?.click()
  }
  
  const handleImageSelect = (event) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          images.value.push(e.target.result)
        }
        reader.readAsDataURL(file)
      }
    }
    
    event.target.value = ''
  }
  
  const removeImage = (index) => {
    images.value.splice(index, 1)
  }
  
  const handleSend = () => {
    if (!inputContent.value.trim() || !props.currentRunningModel || props.generating) {
      return
    }
    
    emit('send', {
      content: inputContent.value.trim(),
      images: [...images.value],
      think: enableThink.value
    })
    
    inputContent.value = ''
    images.value = []
  }
  
  const openSettings = () => {
    emit('open-settings')
  }
  
  const stop = () => {
    emit('stop')
  }
  
  const setInput = (text) => {
    inputContent.value = text
  }
  
  const reset = () => {
    inputContent.value = ''
    images.value = []
  }
  
  // Return all state and methods needed by the template
  return {
    // State
    inputContent,
    images,
    enableThink,
    fileInput,
    
    // Methods
    triggerImageUpload,
    handleImageSelect,
    removeImage,
    handleSend,
    openSettings,
    stop,
    setInput,
    reset,
    
    // Utilities
    t,
    
    // Icons
    PlusIcon,
    Send,
    Square,
    X,
    Settings2
  }
}
