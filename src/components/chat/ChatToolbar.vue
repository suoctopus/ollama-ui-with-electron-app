<template>
  <Toolbar>
    <template #left>
      <span v-if="searchQuery && matchedMessageIds.length > 0" class="search-result-hint">
        {{ $t('chat.foundResults', { count: matchedMessageIds.length }) }}
      </span>
    </template>
    
    <template #right>
      <router-link v-if="!currentRunningModel" to="/models" class="no-model-link">
        <el-button type="warning" plain :icon="AlertCircle" size="small">
          {{ $t('chat.noRunningModel') }}
        </el-button>
      </router-link>
      
      <div v-if="currentRunningModel" class="current-model-display">
        <Cpu :size="16" />
        <span>{{ currentRunningModel }}</span>
      </div>

      <el-button @click="$emit('new-chat')" :icon="PlusIcon" size="small">
        {{ $t('chat.newChat') }}
      </el-button>
    </template>
  </Toolbar>
</template>

<script setup>
import { AlertCircle, Cpu, Plus as PlusIcon } from 'lucide-vue-next'
import Toolbar from '@/components/common/Toolbar.vue'

defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  matchedMessageIds: {
    type: Array,
    default: () => []
  },
  currentRunningModel: {
    type: String,
    default: null
  }
})

defineEmits(['new-chat'])
</script>

<style scoped>
.search-result-hint {
  font-size: 13px;
  color: #faad14;
  font-weight: 500;
}

.current-model-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #e8f5e9;
  border-radius: 4px;
  font-size: 13px;
  color: #2e7d32;
  font-weight: 500;
  border: 1px solid #c8e6c9;
}

.no-model-link {
  text-decoration: none;
}
</style>
