<template>
  <Sidebar :title="$t('history.categories')">
    <template #header>
      <div class="sidebar-header">
        <h3>{{ $t('history.categories') }}</h3>
        <el-button :icon="Plus" circle size="small" @click="$emit('add-category')" />
      </div>
    </template>
    
    <div class="category-list">
      <div 
        class="category-item" 
        :class="{ active: currentCategory === 'all' }"
        @click="$emit('update:currentCategory', 'all')"
      >
        <span class="category-icon"><LayoutGrid :size="16" /></span>
        <span class="category-name">{{ $t('history.allChats') }}</span>
        <span class="category-count">{{ allSessionsCount }}</span>
      </div>
      <div 
        class="category-item" 
        :class="{ active: currentCategory === 'uncategorized' }"
        @click="$emit('update:currentCategory', 'uncategorized')"
      >
        <span class="category-icon"><HelpCircle :size="16" /></span>
        <span class="category-name">{{ $t('history.uncategorized') }}</span>
        <span class="category-count">{{ uncategorizedSessionsCount }}</span>
      </div>
      
      <div class="divider"></div>
      
      <div 
        v-for="cat in categories" 
        :key="cat"
        class="category-item"
        :class="{ active: currentCategory === cat }"
        @click="$emit('update:currentCategory', cat)"
      >
        <span class="category-icon"><Folder :size="16" /></span>
        <span class="category-name">{{ cat }}</span>
        <div class="category-actions">
          <el-button link :icon="Trash2" size="small" @click.stop="$emit('delete-category', cat)" />
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script setup>
import { LayoutGrid, HelpCircle, Folder, Plus, Trash2 } from 'lucide-vue-next'
import Sidebar from '@/components/common/Sidebar.vue'

defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  currentCategory: {
    type: String,
    default: 'all'
  },
  allSessionsCount: {
    type: Number,
    default: 0
  },
  uncategorizedSessionsCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['update:currentCategory', 'add-category', 'delete-category'])
</script>

<style scoped>
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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