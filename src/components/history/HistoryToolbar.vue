<template>
  <Toolbar>
    <template #left>
      <span v-if="filteredSessionsCount > 0" class="sessions-count">
        {{ $t('history.sessionCount', { count: filteredSessionsCount }) }}
      </span>
    </template>
    
    <template #right>
      <el-button 
        type="danger" 
        :disabled="selectedSessionsCount === 0"
        @click="$emit('delete-selected')" 
        :icon="Trash2"
        size="small"
        plain
      >
        {{ $t('history.deleteSelected') }}
      </el-button>
    </template>
  </Toolbar>
</template>

<script setup>
import { Trash2 } from 'lucide-vue-next'
import Toolbar from '@/components/common/Toolbar.vue'

defineProps({
  filteredSessionsCount: {
    type: Number,
    default: 0
  },
  selectedSessionsCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['delete-selected'])
</script>

<style scoped>
.sessions-count {
  font-size: 13px;
  color: #666;
}
</style>
