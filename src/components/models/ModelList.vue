<template>
  <div class="models-content" v-loading="loading">
    <div v-if="filteredModels.length > 0" class="models-grid">
      <ModelCard
        v-for="model in filteredModels"
        :key="model.name"
        :model="model"
        @load="handleLoad"
        @unload="handleUnload"
        @delete="handleDelete"
        @show-details="handleShowDetails"
      />
    </div>
    
    <div v-else-if="!loading" class="empty-state">
      <Box :size="64" color="#ccc" />
      <p>{{ searchQuery ? t('models.noResults') : t('models.noModels') }}</p>
    </div>
  </div>
</template>

<script>
import { Box } from 'lucide-vue-next'
import { useModelList } from '@/composables/models/useModelList'
import { useI18n } from '@/composables/core/useI18n'
import ModelCard from './ModelCard.vue'

export default {
  components: {
    ModelCard,
    Box
  },
  props: {
    filteredModels: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  emits: ['load', 'unload', 'delete', 'show-details'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const modelListComposable = useModelList(props, emit)
    
    return {
      ...modelListComposable,
      t
    }
  }
}
</script>
