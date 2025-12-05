<template>
  <div class="models-toolbar">
    <div class="toolbar-left">
      <span v-if="filteredModels.length > 0" class="models-count">
        {{ filteredModels.length }} 个模型
      </span>
    </div>
    <div class="toolbar-right">
      <el-button @click="$emit('refresh')" :icon="RefreshCw" :loading="loading" size="small">
        {{ $t('models.refresh') }}
      </el-button>
      <el-button type="primary" @click="$emit('open-pull-dialog')" :icon="Download" size="small">
        {{ $t('models.pull') }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { RefreshCw, Download } from 'lucide-vue-next'

defineProps({
  filteredModels: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['refresh', 'open-pull-dialog'])
</script>

<style scoped>
/* Toolbar */
.models-toolbar {
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

.models-count {
  font-size: 13px;
  color: #666;
}
</style>
