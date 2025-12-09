<template>
  <GenericToolbar>
    <template #left>
      <span class="message-count" v-if="messageCount > 0">
        {{ t('chat.totalMessages', { count: messageCount }) }}
      </span>
      <span v-if="searchQuery && matchedMessageIds.length > 0" class="search-result-hint">
        {{ t('chat.foundResults', { count: matchedMessageIds.length }) }}
      </span>
    </template>
    
    <template #right>
      <router-link v-if="!currentRunningModel" to="/models" class="no-model-link">
        <el-button type="warning" plain :icon="AlertCircle" size="small">
          {{ t('chat.noRunningModel') }}
        </el-button>
      </router-link>
      
      <div v-if="currentRunningModel" class="current-model-display">
        <Cpu :size="16" />
        <span>{{ currentRunningModel }}</span>
      </div>

      <el-button @click="handleNewChat" :icon="PlusIcon" size="small">
        {{ t('chat.newChat') }}
      </el-button>
    </template>
  </GenericToolbar>
</template>

<script>
import GenericToolbar from '@/components/common/GenericToolbar.vue'
import { useChatToolbar } from '@/composables/chat/useChatToolbar'
import { AlertCircle, Cpu, Plus as PlusIcon } from 'lucide-vue-next'

export default {
  components: {
    GenericToolbar,
    AlertCircle,
    Cpu,
    PlusIcon
  },
  props: {
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
    },
    messageCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['new-chat'],
  setup(props, { emit }) {
    return useChatToolbar(props, emit)
  }
}
</script>