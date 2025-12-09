import { computed, watch } from 'vue'
import { List, Palette, SlidersHorizontal, Shuffle, AlertTriangle, Server, Cpu, MoreHorizontal } from 'lucide-vue-next'

export function useSettingsSidebar(props, emit, currentSection) {
  // Watch activeTab changes and reset currentSection
  watch(() => props.activeTab, (newTab) => {
    if (newTab === 'general') {
      currentSection.value = 'connection'
    } else {
      currentSection.value = 'basic-generation'
    }
  }, { immediate: true })

  const sidebarItems = computed(() => {
    if (props.activeTab === 'general') {
      return [
        {
          key: 'connection',
          name: '连接设置',
          icon: Server
        },
        {
          key: 'appearance',
          name: '外观设置',
          icon: Palette
        }
      ]
    } else {
      return [
        {
          key: 'basic-generation',
          name: '基础生成参数',
          icon: SlidersHorizontal
        },
        {
          key: 'sampling',
          name: '采样参数',
          icon: Shuffle
        },
        {
          key: 'repetition',
          name: '重复惩罚参数',
          icon: AlertTriangle
        },
        {
          key: 'context',
          name: '上下文参数',
          icon: List
        },
        {
          key: 'hardware',
          name: '硬件参数',
          icon: Cpu
        },
        {
          key: 'other',
          name: '其他参数',
          icon: MoreHorizontal
        }
      ]
    }
  })

  const onSelectSection = (item) => {
    emit('scroll-to', item.key)
  }

  return {
    // State
    sidebarItems,

    // Methods
    onSelectSection
  }
}
