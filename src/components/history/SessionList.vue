<template>
  <div class="history-content">
    <div v-if="filteredSessions.length === 0" class="empty-state">
      <History :size="64" color="#ccc" />
      <p>{{ $t('history.noHistory') }}</p>
    </div>
    
    <el-checkbox-group 
      v-else 
      :model-value="selectedSessions"
      @update:model-value="handleUpdateSelectedSessions"
    >
      <div
        v-for="session in filteredSessions"
        :key="session.id"
        class="session-card"
        :class="{ active: session.id === currentSessionId }"
        @click="handleSelectSession(session)"
      >
        <div class="session-checkbox" @click.stop>
          <el-checkbox :label="session.id">&nbsp;</el-checkbox>
        </div>
        
        <div class="session-main">
          <div class="session-header">
            <h3 class="session-title">
              {{ session.title }}
              <el-tag v-if="session.category" size="small" effect="plain" class="category-tag">
                {{ session.category }}
              </el-tag>
            </h3>
            <div class="session-actions">
              <el-button
                link
                :icon="Edit"
                @click.stop="handleRenameSession(session)"
                :title="$t('history.rename')"
              />
              <el-button
                link
                :icon="FolderInput"
                @click.stop="handleCategorySession(session)"
                :title="$t('history.category')"
              />
              <el-button
                link
                type="danger"
                :icon="Trash2"
                @click.stop="handleDeleteSession(session)"
                :title="$t('history.delete')"
              />
            </div>
          </div>
          
          <div class="session-meta">
            <span class="session-model">
              <Box :size="14" />
              {{ session.model || $t('chat.noModel') }}
            </span>
            <span class="session-messages">
              {{ $t('history.messages', { count: session.messages.length }) }}
            </span>
            <span class="session-time">
              {{ formatTime(session.updatedAt) }}
            </span>
          </div>
          
          <div v-if="session.messages.length > 0" class="session-preview">
            {{ session.messages[session.messages.length - 1].content.substring(0, 100) }}...
          </div>
        </div>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
import { History, Edit, FolderInput, Trash2, Box } from 'lucide-vue-next'
import { useSessionList } from '@/composables/history/useSessionList'

export default {
  components: {
    History,
    Edit,
    FolderInput,
    Trash2,
    Box
  },
  props: {
    filteredSessions: {
      type: Array,
      default: () => []
    },
    currentSessionId: {
      type: String,
      default: null
    },
    selectedSessions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['select-session', 'rename-session', 'category-session', 'delete-session', 'update:selectedSessions'],
  setup(props, { emit }) {
    return useSessionList(props, emit)
  }
}
</script>
