<template>
  <div class="models-content" v-loading="loading">
    <div v-if="filteredModels.length > 0" class="models-grid">
      <ModelCard
        v-for="model in filteredModels"
        :key="model.name"
        :model="model"
        @load="$emit('load', $event)"
        @unload="$emit('unload', $event)"
        @delete="$emit('delete', $event)"
        @show-details="$emit('show-details', $event)"
      />
    </div>
    
    <div v-else-if="!loading" class="empty-state">
      <Box :size="64" color="#ccc" />
      <p>{{ searchQuery ? $t('models.noResults') : $t('models.noModels') }}</p>
    </div>
  </div>
</template>

<script setup>
import { Box } from 'lucide-vue-next'
import ModelCard from './ModelCard.vue'

defineProps({
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
})

defineEmits(['load', 'unload', 'delete', 'show-details'])
</script>

<style scoped>
.models-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
}

@media (max-width: 768px) {
  .models-grid {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
}

.empty-state p {
  margin-top: 16px;
  font-size: 16px;
}
</style>
