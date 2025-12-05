<template>
  <Toolbar>
    <template #left>
      <span v-if="filteredModels.length > 0" class="models-count">
        {{ $t('models.modelCount', { count: filteredModels.length }) }}
      </span>
    </template>
    
    <template #right>
      <el-button @click="$emit('refresh')" :icon="RefreshCw" :loading="loading" size="small">
        {{ $t('models.refresh') }}
      </el-button>
      <el-button type="primary" @click="$emit('open-pull-dialog')" :icon="Download" size="small">
        {{ $t('models.pull') }}
      </el-button>
    </template>
  </Toolbar>
</template>

<script setup>
import { RefreshCw, Download } from 'lucide-vue-next'
import Toolbar from '@/components/common/Toolbar.vue'

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
.models-count {
  font-size: 13px;
  color: #666;
}
</style>
