<template>
  <GenericSidebar
    :title="$t('models.categories')"
    :items="sidebarItems"
    v-model="currentFamily"
    @select="onSelectFamily"
  />
</template>

<script setup>
import { computed } from 'vue'
import { LayoutGrid, Box } from 'lucide-vue-next'
import GenericSidebar from '@/components/common/GenericSidebar.vue'

const props = defineProps({
  models: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue'])

const currentFamily = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

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

const sidebarItems = computed(() => {
  const items = [{
    key: 'all',
    name: $t('models.allModels'),
    icon: LayoutGrid,
    count: props.models.length
  }]
  
  modelFamilies.value.forEach(family => {
    items.push({
      key: family,
      name: family,
      icon: Box,
      count: getModelCountByFamily(family)
    })
  })
  
  return items
})

const onSelectFamily = (item) => {
  emit('update:modelValue', item.key)
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
</style>