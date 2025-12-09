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
          {{ t('models.running') }}
        </el-tag>
        <el-tag v-else-if="isModelLoading(model.name)" type="warning" effect="light" size="small">
          <el-icon class="is-loading"><Loading /></el-icon>
          {{ t('common.loading') }}
        </el-tag>
      </div>
    </div>

    <!-- Card Body -->
    <div class="card-body">
      <div class="model-details">
        <div class="detail-item">
          <span class="detail-label">{{ t('models.parameterSize') }}</span>
          <span class="detail-value">{{ model.details?.parameter_size || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ t('models.quantization') }}</span>
          <span class="detail-value">{{ model.details?.quantization_level || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ t('models.modified') }}</span>
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
              style="width: 100px"
              :disabled="getKeepAlivePermanent(model.name)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Card Actions -->
    <div class="card-actions">
      <el-button
        v-if="!isRunning(model.name)"
        type="primary"
        @click="handleLoad"
        :loading="isModelLoading(model.name)"
        :disabled="isModelLoading(model.name)"
        size="small"
      >
        <template #icon><PlayCircle v-if="!isModelLoading(model.name)" :size="14" /></template>
        {{ isModelLoading(model.name) ? t('common.loading') : t('models.load') }}
      </el-button>
      <el-button
        v-else
        type="warning"
        @click="handleUnload"
        :loading="isModelLoading(model.name)"
        size="small"
      >
        <template #icon><StopCircle v-if="!isModelLoading(model.name)" :size="14" /></template>
        {{ t('models.unload') }}
      </el-button>
      
      <el-button :icon="Info" @click="handleShowDetails" size="small">
        {{ t('models.show') }}
      </el-button>
      
      <el-button :icon="Trash2" @click="handleDelete" type="danger" size="small">
        {{ t('models.delete') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { Box, PlayCircle, StopCircle, Info, Trash2 } from 'lucide-vue-next'
import { Loading } from '@element-plus/icons-vue'
import { useModelCard } from '@/composables/models/useModelCard'

export default {
  components: {
    Box,
    PlayCircle,
    StopCircle,
    Info,
    Trash2,
    Loading
  },
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  emits: ['load', 'unload', 'show-details', 'delete'],
  setup(props, { emit }) {
    return useModelCard(props, emit)
  }
}
</script>