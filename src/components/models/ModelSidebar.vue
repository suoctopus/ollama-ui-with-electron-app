<template>
  <div class="models-sidebar">
    <div class="sidebar-header">
      <h3>模型分类</h3>
    </div>
    <div class="category-list">
      <div 
        class="category-item" 
        :class="{ active: currentFamily === 'all' }"
        @click="$emit('update:currentFamily', 'all')"
      >
        <span class="category-icon"><LayoutGrid :size="16" /></span>
        <span class="category-name">全部模型</span>
        <span class="category-count">{{ models.length }}</span>
      </div>
      <div 
        v-for="family in modelFamilies" 
        :key="family"
        class="category-item"
        :class="{ active: currentFamily === family }"
        @click="$emit('update:currentFamily', family)"
      >
        <span class="category-icon"><Box :size="16" /></span>
        <span class="category-name">{{ family }}</span>
        <span class="category-count">{{ getModelCountByFamily(family) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LayoutGrid, Box } from 'lucide-vue-next'

const props = defineProps({
  models: {
    type: Array,
    required: true
  },
  currentFamily: {
    type: String,
    default: 'all'
  }
})

defineEmits(['update:currentFamily'])

// Get unique model families
const modelFamilies = computed(() => {
  const families = new Set()
  props.models.forEach(m => {
    if (m.details?.family) {
      families.add(m.details.family)
    }
  })
  return Array.from(families).sort()
})

// Get model count by family
const getModelCountByFamily = (family) => {
  return props.models.filter(m => m.details?.family === family).length
}
</script>

<style scoped>
/* Sidebar */
.models-sidebar {
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
</style>
