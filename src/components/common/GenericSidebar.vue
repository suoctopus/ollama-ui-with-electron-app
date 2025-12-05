<template>
  <Sidebar :title="title">
    <template #header v-if="showHeaderSlot">
      <slot name="header" />
    </template>
    
    <div class="category-list">
      <div 
        v-for="(item, index) in items" 
        :key="item.key || index"
        class="category-item"
        :class="{ active: isActive(item) }"
        @click="selectItem(item)"
      >
        <span v-if="item.icon" class="category-icon">
          <component :is="item.icon" :size="16" />
        </span>
        <span class="category-name">{{ item.name }}</span>
        <span v-if="item.count !== undefined" class="category-count">{{ item.count }}</span>
        <div v-if="item.actions" class="category-actions">
          <el-button 
            v-for="(action, actionIndex) in item.actions" 
            :key="actionIndex"
            link 
            :icon="action.icon" 
            size="small" 
            @click.stop="action.handler(item)"
          />
        </div>
      </div>
      
      <div v-if="showDivider" class="divider"></div>
      
      <slot />
    </div>
  </Sidebar>
</template>

<script setup>
import Sidebar from '@/components/common/Sidebar.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [String, Object],
    default: null
  },
  showHeaderSlot: {
    type: Boolean,
    default: false
  },
  showDivider: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const isActive = (item) => {
  return props.modelValue === item.key || props.modelValue === item
}

const selectItem = (item) => {
  emit('update:modelValue', item.key || item)
  emit('select', item)
}
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-count {
  font-size: 12px;
  color: #999;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
}

.category-item.active .category-count {
  background: #bae7ff;
  color: #096dd9;
}

.category-actions {
  display: none;
}

.category-item:hover .category-actions {
  display: flex;
}

.divider {
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
}
</style>