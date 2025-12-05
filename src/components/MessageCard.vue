<template>
  <div class="message-card" :class="[`message-${message.role}`, { 'is-collapsed': isContentCollapsed }]">
    <div class="message-avatar">
      <User v-if="message.role === 'user'" :size="20" />
      <Bot v-else-if="message.role === 'assistant'" :size="20" />
      <Settings v-else :size="20" />
    </div>
    
    <div class="message-content">
      <div class="message-header">
        <div class="header-left">
          <span class="message-role">{{ roleText }}</span>
          <span class="message-index" v-if="messageIndex">#{{ messageIndex }}</span>
          <span class="message-time">{{ formatTime(message.createdAt) }}</span>
        </div>
        <div class="header-actions">
          <el-button 
            circle 
            size="small"
            @click="handleHide"
            :icon="EyeOff"
            :title="$t('chat.hide')"
          />
          <el-button 
            circle 
            size="small"
            @click="isContentCollapsed = !isContentCollapsed"
            :icon="isContentCollapsed ? ChevronDown : ChevronUp"
            :title="isContentCollapsed ? $t('chat.expand') : $t('chat.collapse')"
          />
        </div>
      </div>
      
      <div v-if="message.thinking" v-show="!isContentCollapsed" class="message-thinking">
        <div class="thinking-header" @click="isThinkingCollapsed = !isThinkingCollapsed">
          <span class="thinking-label">{{ thinkingLabel }}</span>
          <ChevronDown :size="16" class="collapse-icon" :class="{ 'is-collapsed': isThinkingCollapsed }" />
        </div>
        <div v-show="!isThinkingCollapsed" class="markdown-content" v-html="renderMarkdown(message.thinking)"></div>
      </div>
      
      <div v-show="!isContentCollapsed" class="markdown-content" v-html="renderMarkdown(message.content)"></div>
      
      <div v-if="message.images && message.images.length > 0" v-show="!isContentCollapsed" class="message-images">
        <img
          v-for="(image, index) in message.images"
          :key="index"
          :src="`data:image/png;base64,${image}`"
          alt="附件图片"
        />
      </div>
      
      <div v-show="!isContentCollapsed" class="message-actions">
        <el-button link @click="handleCopy" :icon="Copy">
          {{ $t('chat.copy') }}
        </el-button>
        
        <el-button
          v-if="message.role === 'assistant'"
          link
          @click="handleRegenerate"
          :icon="RefreshCw"
        >
          {{ $t('chat.regenerate') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { User, Bot, Settings, Copy, Trash2, RefreshCw, ChevronDown, ChevronUp, EyeOff } from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  messageIndex: {
    type: Number,
    default: 0
  }
})

const isThinkingCollapsed = ref(false)
const isContentCollapsed = ref(false)
const isGenerating = ref(false)

const emit = defineEmits(['delete', 'regenerate', 'hide'])

const { t } = useI18n()

const md = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
      } catch (__) {}
    }
    return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
  },
})

const roleText = computed(() => {
  const roleMap = {
    user: t('chat.user'),
    assistant: t('chat.assistant'),
    system: t('chat.system'),
  }
  return roleMap[props.message.role] || props.message.role
})

const thinkingLabel = computed(() => {
  // If message has thinking content that's done generating, show "Thought Process"
  // If it's still generating (empty or being streamed), show "Thinking..."
  if (props.message.thinking && props.message.content) {
    return t('chat.thinkingProcess')
  }
  return t('chat.thinkingInProgress')
})

const renderMarkdown = (content) => {
  if (!content) return ''
  return md.render(content)
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  
  // 直接返回年月日时间，精确到分
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const handleDelete = () => {
  emit('delete', props.message.id)
}

const handleHide = () => {
  emit('hide', props.message.id)
}

const handleRegenerate = () => {
  emit('regenerate', props.message.id)
}
</script>

<style scoped>
.message-card {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 8px;
  border-radius: 8px;
  background: white;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.message-user {
  background: #f0f9ff;
}

.message-assistant {
  background: #f9fafb;
}

.message-avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-user .message-avatar {
  background: #67c23a;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message-card:hover .header-actions {
  opacity: 1;
}

.message-card.is-collapsed .message-thinking,
.message-card.is-collapsed .message-images,
.message-card.is-collapsed .message-actions {
  display: none;
}

.message-role {
  font-weight: 600;
  color: #333;
}

.message-index {
  font-weight: 500;
  color: #999;
  font-size: 12px;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-thinking {
  margin-bottom: 12px;
  padding: 12px;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
}

.thinking-label {
  font-size: 12px;
  font-weight: 600;
  color: #856404;
  color: #856404;
  margin-bottom: 0;
}

.thinking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 8px;
}

.collapse-icon {
  transition: transform 0.2s;
  color: #856404;
}

.collapse-icon.is-collapsed {
  transform: rotate(-90deg);
}

.message-images {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.message-images img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.message-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
</style>