<template>
  <div class="settings-sidebar">
    <div class="sidebar-header">
      <h3>设置分类</h3>
    </div>
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
  </div>
</template>

<script setup>
import { Settings as SettingsIcon, Sliders } from 'lucide-vue-next'

defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

defineEmits(['update:activeTab'])
</script>

<style scoped>
/* Sidebar */
.settings-sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

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
</style>
