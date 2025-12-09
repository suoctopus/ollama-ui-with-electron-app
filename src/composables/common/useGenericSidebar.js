// src/composables/common/useGenericSidebar.js
import Sidebar from '@/components/common/Sidebar.vue'

export function useGenericSidebar(props, emit) {
  const isActive = (item) => {
    return props.modelValue === item.key || props.modelValue === item
  }
  
  const selectItem = (item) => {
    emit('update:modelValue', item.key || item)
    emit('select', item)
  }
  
  return {
    Sidebar,
    isActive,
    selectItem
  }
}
