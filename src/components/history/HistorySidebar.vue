<template>
  <GenericSidebar
    :title="$t('history.categories')"
    :items="sidebarItems"
    v-model="currentCategory"
    :show-header-slot="true"
    :show-divider="true"
    @select="onSelectCategory"
  >
    <template #header>
      <div class="sidebar-header">
        <h3>{{ $t('history.categories') }}</h3>
        <el-button :icon="Plus" circle size="small" @click="$emit('add-category')" />
      </div>
    </template>
  </GenericSidebar>
</template>

<script setup>
import { computed } from 'vue'
import { LayoutGrid, HelpCircle, Folder, Plus, Trash2 } from 'lucide-vue-next'
import GenericSidebar from '@/components/common/GenericSidebar.vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  modelValue: {
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

const emit = defineEmits(['update:modelValue', 'add-category', 'delete-category'])

const currentCategory = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const sidebarItems = computed(() => {
  const items = [
    {
      key: 'all',
      name: $t('history.allChats'),
      icon: LayoutGrid,
      count: props.allSessionsCount
    },
    {
      key: 'uncategorized',
      name: $t('history.uncategorized'),
      icon: HelpCircle,
      count: props.uncategorizedSessionsCount
    }
  ]
  
  props.categories.forEach(category => {
    items.push({
      key: category,
      name: category,
      icon: Folder,
      actions: [
        {
          icon: Trash2,
          handler: () => emit('delete-category', category)
        }
      ]
    })
  })
  
  return items
})

const onSelectCategory = (item) => {
  emit('update:modelValue', item.key)
}
</script>

<style scoped>
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 56px; /* 统一标题行高度 */
}

.sidebar-header h3 {
  font-size: 16px; /* 统一字体大小 */
  text-align: left; /* 左对齐 */
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