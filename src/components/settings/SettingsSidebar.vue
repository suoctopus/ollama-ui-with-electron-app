<template>
  <GenericSidebar
    title="设置分类"
    :items="sidebarItems"
    v-model="currentSection"
    @select="onSelectSection"
  />
</template>

<script setup>
import { computed, watch } from 'vue'
import { List, Palette, SlidersHorizontal, Shuffle, AlertTriangle, Server, Cpu, MoreHorizontal } from 'lucide-vue-next'
import GenericSidebar from '@/components/common/GenericSidebar.vue'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['scroll-to'])

const currentSection = defineModel({ type: String, default: 'connection' })

// 监听activeTab变化，重置currentSection
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
</script>

<style scoped>
/* 移除原来的样式，因为现在使用的是通用组件 */
</style>