<template>
  <GenericSidebar
    :title="title"
    :items="sidebarItems"
    v-model="currentCategory"
    :show-header-slot="true"
    :show-divider="true"
    @select="onSelectCategory"
  >
    <template #header>
      <div class="sidebar-header">
        <h3>{{ title }}</h3>
        <el-button :icon="Plus" circle size="small" @click="$emit('add-category')" />
      </div>
    </template>
  </GenericSidebar>
</template>

<script>
import { useHistorySidebar } from '@/composables/history/useHistorySidebar'
import GenericSidebar from '@/components/common/GenericSidebar.vue'

export default {
  components: {
    GenericSidebar
  },
  props: {
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
  },
  emits: ['update:modelValue', 'add-category', 'delete-category'],
  setup(props, { emit }) {
    return useHistorySidebar(props, emit)
  }
}
</script>