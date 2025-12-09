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

<script>
import Sidebar from './Sidebar.vue'
import { useGenericSidebar } from '@/composables/common/useGenericSidebar'

export default {
  components: {
    Sidebar
  },
  props: {
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
  },
  emits: ['update:modelValue', 'select'],
  setup(props, { emit }) {
    return useGenericSidebar(props, emit)
  }
}
</script>