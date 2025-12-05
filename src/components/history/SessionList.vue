<template>
  <div class="history-content">
    <div v-if="filteredSessions.length === 0" class="empty-state">
      <History :size="64" color="#ccc" />
      <p>{{ $t('history.noHistory') }}</p>
    </div>
    
    <el-checkbox-group 
      v-else 
      :model-value="selectedSessions"
      @update:model-value="$emit('update:selectedSessions', $event)"
    >
      <div
        v-for="session in filteredSessions"
        :key="session.id"
        class="session-card"
        :class="{ active: session.id === currentSessionId }"
        @click="$emit('select-session', session)"
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
                @click.stop="$emit('rename-session', session)"
                :title="$t('history.rename')"
              />
              <el-button
                link
                :icon="FolderInput"
                @click.stop="$emit('category-session', session)"
                :title="$t('history.category')"
              />
              <el-button
                link
                type="danger"
                :icon="Trash2"
                @click.stop="$emit('delete-session', session)"
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

<script setup>
import { History, Edit, FolderInput, Trash2, Box } from 'lucide-vue-next'

defineProps({
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
})

defineEmits(['select-session', 'rename-session', 'category-session', 'delete-session', 'update:selectedSessions'])

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.history-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.history-content .el-checkbox-group {
  width: 100%;
  max-width: 800px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.empty-state p {
  margin-top: 16px;
  font-size: 16px;
}

.session-card {
  display: flex;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.session-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
  transform: translateY(-1px);
}

.session-card.active {
  border-color: #409eff;
  background: #f0f9ff;
}

.session-checkbox {
  display: flex;
  align-items: flex-start;
  padding-right: 12px;
  padding-top: 4px;
}

.session-main {
  flex: 1;
  min-width: 0;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.session-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-tag {
  font-weight: normal;
}

.session-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.session-card:hover .session-actions {
  opacity: 1;
}

.session-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.session-model {
  display: flex;
  align-items: center;
  gap: 4px;
}

.session-time {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

.session-preview {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
