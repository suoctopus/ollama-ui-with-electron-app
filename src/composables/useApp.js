import { onMounted, computed } from 'vue'
import { useSettings, useChatState } from '@/composables/core/useState'

export function useApp() {
  const { settings, loadFromStorage: loadSettings } = useSettings()
  const { loadFromStorage: loadChat } = useChatState()
  
  // 计算应用的字体大小样式
  const appStyle = computed(() => ({
    fontSize: settings.value.fontSize + 'px'
  }))
  
  // 在组件挂载时加载数据
  onMounted(() => {
    // 从 localStorage 加载设置
    loadSettings()
    loadChat()
  })
  
  return {
    appStyle
  }
}
