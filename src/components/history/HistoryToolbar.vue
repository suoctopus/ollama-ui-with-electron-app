<template>
  <div class="history-toolbar">
    <div class="toolbar-left">
      <span v-if="filteredSessionsCount > 0" class="sessions-count">
        {{ filteredSessionsCount }} 条记录
      </span>
    </div>
    <div class="toolbar-right">
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
    </div>
  </div>
</template>

<script setup>
import { Trash2 } from 'lucide-vue-next'

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
/* Toolbar */
.history-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sessions-count {
  font-size: 13px;
  color: #666;
}
</style>
