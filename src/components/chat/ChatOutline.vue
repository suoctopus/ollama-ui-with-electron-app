<template>
  <div class="outline-panel">
    <div class="outline-panel-header">
      <span class="outline-title">{{ t('chat.outline') }}</span>
    </div>

    <div v-if="isInputHidden" class="restore-section">
      <el-alert :title="t('chat.inputHidden')" type="warning" :closable="false" show-icon />
      <el-button type="primary" @click="handleRestoreInput" style="margin-top: 10px; width: 100%">
        {{ t('chat.restoreInput') }}
      </el-button>
    </div>
    <div class="outline-list" ref="outlineList">
      <div 
        v-for="(msg, index) in messages" 
        :key="msg.id" 
        class="outline-item" 
        :class="{ 'active': activeMessageId === msg.id, 'is-hidden': msg.hidden, 'is-matched': isMessageMatched(msg.id) }"
        @click="handleScrollToMessage(msg.id)"
        :id="'outline-' + msg.id"
      >
        <div class="outline-header-row">
          <div class="outline-role">
            <User v-if="msg.role === 'user'" :size="14" />
            <Bot v-else :size="14" />
            <span>#{{ index + 1 }} {{ msg.role === 'user' ? t('chat.user') : t('chat.assistant') }}</span>
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
            @click.stop="handleRestoreMessage(msg.id)"
          >
            {{ t('chat.restore') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useChatOutline } from '@/composables/chat/useChatOutline'
import { User, Bot, Eye } from 'lucide-vue-next'

export default {
  components: {
    User,
    Bot,
    Eye
  },
  props: {
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
  },
  emits: ['restore-input', 'scroll-to-message', 'restore-message'],
  setup(props, { emit }) {
    return useChatOutline(props, emit)
  }
}
</script>