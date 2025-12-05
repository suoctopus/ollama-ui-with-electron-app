<template>
  <div 
    class="model-card"
    :class="{ 'is-running': isRunning(model.name), 'is-loading': isModelLoading(model.name) }"
  >
    <!-- Card Header -->
    <div class="card-header">
      <div class="model-icon">
        <Box :size="24" />
      </div>
      <div class="model-info">
        <div class="model-name">{{ model.name }}</div>
        <div class="model-meta">
          <el-tag size="small" type="info">{{ model.details?.family || 'unknown' }}</el-tag>
          <span class="model-size">{{ formatSize(model.size) }}</span>
        </div>
      </div>
      <div class="model-status">
        <el-tag v-if="isRunning(model.name)" type="success" effect="dark" size="small">
          <span class="status-dot"></span>
          {{ $t('models.running') }}
        </el-tag>
        <el-tag v-else-if="isModelLoading(model.name)" type="warning" effect="light" size="small">
          <el-icon class="is-loading"><Loading /></el-icon>
          {{ $t('common.loading') }}
        </el-tag>
      </div>
    </div>

    <!-- Card Body -->
    <div class="card-body">
      <div class="model-details">
        <div class="detail-item">
          <span class="detail-label">{{ $t('models.parameterSize') }}</span>
          <span class="detail-value">{{ model.details?.parameter_size || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ $t('models.quantization') }}</span>
          <span class="detail-value">{{ model.details?.quantization_level || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ $t('models.modified') }}</span>
          <span class="detail-value">{{ formatDate(model.modified_at) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Keep Alive</span>
          <div class="keep-alive-wrapper">
            <el-switch 
              :model-value="getKeepAlivePermanent(model.name)"
              @update:model-value="(val) => setKeepAlivePermanent(model.name, val)"
              inline-prompt
              active-text="永久"
              inactive-text="自定"
              style="margin-right: 8px"
            />
            <el-input 
              :model-value="getKeepAliveDuration(model.name)"
              @update:model-value="(val) => setKeepAliveDuration(model.name, val)"
              size="small" 
              style="width: 70px"
              :disabled="getKeepAlivePermanent(model.name)"
            >
              <template #suffix>m</template>
            </el-input>
          </div>
        </div>
      </div>
    </div>

    <!-- Card Actions -->
    <div class="card-actions">
      <el-button
        v-if="!isRunning(model.name)"
        type="primary"
        @click="$emit('load', model)"
        :loading="isModelLoading(model.name)"
        :disabled="isModelLoading(model.name)"
        size="small"
      >
        <template #icon><PlayCircle v-if="!isModelLoading(model.name)" :size="14" /></template>
        {{ isModelLoading(model.name) ? $t('common.loading') : $t('models.load') }}
      </el-button>
      <el-button
        v-else
        type="warning"
        @click="$emit('unload', model)"
        :loading="isModelLoading(model.name)"
        size="small"
      >
        <template #icon><StopCircle v-if="!isModelLoading(model.name)" :size="14" /></template>
        {{ $t('models.unload') }}
      </el-button>
      
      <el-button :icon="Info" @click="$emit('show-details', model)" size="small">
        {{ $t('models.show') }}
      </el-button>
      
      <el-button :icon="Trash2" @click="$emit('delete', model)" type="danger" size="small">
        {{ $t('models.delete') }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useModelStore } from '@/store/models'
import { Box, PlayCircle, StopCircle, Info, Trash2 } from 'lucide-vue-next'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({
  model: {
    type: Object,
    required: true
  }
})

defineEmits(['load', 'unload', 'show-details', 'delete'])

const modelStore = useModelStore()

const isRunning = (modelName) => {
  return modelStore.isModelRunning(modelName)
}

const isModelLoading = (modelName) => {
  return modelStore.isModelLoading(modelName)
}

const formatSize = (bytes) => {
  if (!bytes) return '-'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  if (diff < 86400000) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const getKeepAlivePermanent = (name) => {
  return modelStore.modelKeepAliveSettings[name] === '-1'
}

const setKeepAlivePermanent = (name, isPerm) => {
  if (isPerm) {
    modelStore.setModelKeepAlive(name, '-1')
  } else {
    modelStore.setModelKeepAlive(name, '5m')
  }
}

const getKeepAliveDuration = (name) => {
  const val = modelStore.modelKeepAliveSettings[name]
  if (val === '-1') return '-1' // Explicitly show -1 when permanent
  if (!val) return '5'
  return val.replace('m', '')
}

const setKeepAliveDuration = (name, val) => {
  // Only update if it's a valid number
  if (!isNaN(val) && val > 0) {
    modelStore.setModelKeepAlive(name, `${val}m`)
  }
}
</script>

<style scoped>
.model-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Important for flex child truncation */
}

.model-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.model-card.is-running {
  border-color: #67c23a;
  box-shadow: 0 0 0 1px rgba(103, 194, 58, 0.2);
}

.model-card.is-loading {
  opacity: 0.8;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.model-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.model-info {
  flex: 1;
  min-width: 0;
}

.model-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
  word-break: break-all;
}

.model-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.model-size {
  font-size: 12px;
  color: #999;
}

.model-status {
  flex-shrink: 0;
}

.model-status .el-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.card-body {
  padding: 16px;
  flex: 1;
}

.model-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.detail-label {
  color: #999;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

.keep-alive-wrapper {
  display: flex;
  align-items: center;
}

.card-actions {
  padding: 12px 16px;
  background: #f9fafc;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}
</style>
