<template>
  <GenericSidebar
    title="设置分类"
    :items="sidebarItems"
    v-model="currentSection"
    @select="onSelectSection"
  />
</template>

<script>
import { computed } from 'vue'
import GenericSidebar from '@/components/common/GenericSidebar.vue'
import { useSettingsSidebar } from '@/composables/settings/useSettingsSidebar'

export default {
  components: {
    GenericSidebar
  },
  props: {
    activeTab: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      default: 'connection'
    }
  },
  emits: ['scroll-to', 'update:modelValue'],
  setup(props, { emit }) {
    const currentSection = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })
    
    const { sidebarItems, onSelectSection } = useSettingsSidebar(props, emit, currentSection)
    
    return {
      currentSection,
      sidebarItems,
      onSelectSection
    }
  }
}
</script>
