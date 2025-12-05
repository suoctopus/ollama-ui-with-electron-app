<template>
  <Sidebar title="设置分类">
    <div class="category-list">
      <div 
        class="category-item" 
        :class="{ active: activeTab === 'general' }"
        @click="$emit('update:activeTab', 'general')"
      >
        <span class="category-icon"><SettingsIcon :size="16" /></span>
        <span class="category-name">{{ $t('settings.general') }}</span>
      </div>
      <div 
        class="category-item" 
        :class="{ active: activeTab === 'advanced' }"
        @click="$emit('update:activeTab', 'advanced')"
      >
        <span class="category-icon"><Sliders :size="16" /></span>
        <span class="category-name">{{ $t('settings.advancedSettings') }}</span>
      </div>
    </div>
  </Sidebar>
</template>

<script setup>
import { Settings as SettingsIcon, Sliders } from 'lucide-vue-next'
import Sidebar from '@/components/common/Sidebar.vue'

defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

defineEmits(['update:activeTab'])
</script>

<style scoped>
.category-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.category-item:hover {
  background: #f5f7fa;
  color: #333;
}

.category-item.active {
  background: #e6f7ff;
  color: #409eff;
  font-weight: 500;
}

.category-icon {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.category-name {
  flex: 1;
}

/* 在这里添加设置项的样式，使其与其它面板保持一致 */
.settings-item {
  height: 56px; /* 统一标题行高度 */
  font-size: 16px; /* 统一字体大小 */
  text-align: left; /* 左对齐 */
}
</style>