<template>
  <div class="outline-panel">
    <div class="outline-panel-header">
      <span class="outline-title">{{ $t('chat.outline') }}</span>
    </div>
    


    <div v-if="isInputHidden" class="restore-section">
      <el-alert :title="$t('chat.inputHidden')" type="warning" :closable="false" show-icon />
      <el-button type="primary" @click="$emit('restore-input')" style="margin-top: 10px; width: 100%">
        {{ $t('chat.restoreInput') }}
      </el-button>
    </div>
    <div class="outline-list" ref="outlineList">
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="outline-item" 
        :class="{ 'active': activeMessageId === msg.id, 'is-hidden': msg.hidden, 'is-matched': isMessageMatched(msg.id) }"
        @click="$emit('scroll-to-message', msg.id)"
        :id="'outline-' + msg.id"
      >
        <div class="outline-header-row">
          <div class="outline-role">
            <User v-if="msg.role === 'user'" :size="14" />
            <Bot v-else :size="14" />
            <span>{{ msg.role === 'user' ? $t('chat.user') : $t('chat.assistant') }}</span>
          </div>
          <div class="outline-time">{{ new Date(msg.createdAt).toLocaleTimeString() }}</div>
        </div>
        <div class="outline-content">{{ msg.content }}</div>
        <div v-if="msg.hidden" class="outline-actions">
          <el-button 
            link 
            type="primary" 
            size="small" 
            :icon="Eye"
            @click.stop="$emit('restore-message', msg.id)"
          >
            {{ $t('chat.restore') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { User, Bot, Eye } from 'lucide-vue-next'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  activeMessageId: {
    type: String,
    default: null
  },
  isInputHidden: {
    type: Boolean,
    default: false
  },
  matchedMessageIds: {
    type: Array,
    default: () => []
  }
})

defineEmits(['restore-input', 'scroll-to-message', 'restore-message'])

const outlineList = ref(null)

const isMessageMatched = (msgId) => {
  return props.matchedMessageIds.includes(msgId)
}

watch(() => props.activeMessageId, (newId) => {
  if (newId) {
    nextTick(() => {
      const outlineItem = document.getElementById('outline-' + newId)
      if (outlineItem) {
        outlineItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })
  }
})
</script>

<style scoped>
/* Left Outline Panel */
.outline-panel {
  width: 260px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative; /* For absolute positioning of the close button */
  height: 100%;
}

.outline-panel-header {
  padding: 16px; /* 统一边距 */
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-start; /* 左对齐 */
  align-items: center;
  position: relative;
  height: 56px; /* 统一标题行高度 */
}

.outline-title {
  font-weight: 600;
  color: #333;
  font-size: 16px; /* 统一字体大小 */
  text-align: left; /* 左对齐 */
}



.outline-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.outline-item {
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  font-size: 13px;
}

.outline-item:hover {
  background: #f5f5f5;
}

.outline-item.active {
  background: #e3f2fd;
  border-color: #bbdefb;
}

.outline-item.is-hidden {
  opacity: 0.6;
  background: #f0f0f0;
}

.outline-item.is-matched {
  background-color: #fff9c4; /* Light yellow highlight */
  border-color: #fff59d;
}

.outline-item.active.is-matched {
  background-color: #fff59d; /* Darker yellow if active and matched */
  border-color: #ffe082;
}

.outline-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.outline-role {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: #555;
}

.outline-time {
  font-size: 11px;
  color: #999;
}

.outline-content {
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.outline-actions {
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
}

.restore-section {
  padding: 10px;
  border-bottom: 1px solid #eee;
  background: #fff3e0;
}
</style>