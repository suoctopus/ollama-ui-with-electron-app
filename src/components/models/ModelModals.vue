<template>
  <div>
    <!-- Pull Model Dialog -->
    <el-dialog
      :model-value="pullDialogVisible"
      @update:model-value="$emit('update:pullDialogVisible', $event)"
      :title="$t('models.pullModel')"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item :label="$t('models.modelName')">
          <el-input
            v-model="pullModelName"
            :placeholder="$t('models.modelNamePlaceholder')"
            :disabled="pulling"
          />
        </el-form-item>
        
        <div v-if="pulling" class="pull-progress">
          <div class="progress-status">{{ pullStatus }}</div>
          <el-progress
            v-if="pullProgress > 0"
            :percentage="pullProgress"
            :status="pullProgress === 100 ? 'success' : undefined"
          />
        </div>
        
        <el-alert
          v-if="pullError"
          type="error"
          :title="pullError"
          :closable="false"
          show-icon
          style="margin-top: 12px"
        />
      </el-form>
      
      <template #footer>
        <el-button @click="$emit('update:pullDialogVisible', false)" :disabled="pulling">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="handlePullModel"
          :loading="pulling"
          :disabled="!pullModelName.trim() || pulling"
        >
          {{ pulling ? $t('models.pulling') : $t('models.pull') }}
        </el-button>
      </template>
    </el-dialog>
    
    <!-- Model Details Dialog -->
    <el-dialog
      :model-value="detailsDrawerVisible"
      @update:model-value="$emit('update:detailsDrawerVisible', $event)"
      :title="$t('models.modelDetails')"
      width="500px"
      align-center
      class="model-details-dialog"
    >
      <div v-if="selectedModel" class="details-content">
        <div class="details-section">
          <h4>{{ $t('models.basicInfo') }}</h4>
          <div class="details-grid">
            <div class="details-item">
              <span class="item-label">{{ $t('models.name') }}</span>
              <span class="item-value">{{ selectedModel.name }}</span>
            </div>
            <div class="details-item">
              <span class="item-label">{{ $t('models.size') }}</span>
              <span class="item-value">{{ formatSize(selectedModel.size) }}</span>
            </div>
            <div class="details-item">
              <span class="item-label">{{ $t('models.family') }}</span>
              <span class="item-value">{{ selectedModel.details?.family || '-' }}</span>
            </div>
            <div class="details-item">
              <span class="item-label">{{ $t('models.format') }}</span>
              <span class="item-value">{{ selectedModel.details?.format || '-' }}</span>
            </div>
            <div class="details-item">
              <span class="item-label">{{ $t('models.parameterSize') }}</span>
              <span class="item-value">{{ selectedModel.details?.parameter_size || '-' }}</span>
            </div>
            <div class="details-item">
              <span class="item-label">{{ $t('models.quantization') }}</span>
              <span class="item-value">{{ selectedModel.details?.quantization_level || '-' }}</span>
            </div>
            <div class="details-item full-width">
              <span class="item-label">{{ $t('models.modified') }}</span>
              <span class="item-value">{{ formatDate(selectedModel.modified_at) }}</span>
            </div>
          </div>
        </div>
        
        <div class="details-section">
          <h4>Digest</h4>
          <code class="digest-code">{{ selectedModel.digest }}</code>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { pullModel } from '@/api/ollama'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  pullDialogVisible: {
    type: Boolean,
    default: false
  },
  detailsDrawerVisible: {
    type: Boolean,
    default: false
  },
  selectedModel: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:pullDialogVisible', 'update:detailsDrawerVisible', 'pull-success'])

const { t } = useI18n()

const pullModelName = ref('')
const pulling = ref(false)
const pullProgress = ref(0)
const pullStatus = ref('')
const pullError = ref('')

const handlePullModel = async () => {
  if (!pullModelName.value.trim()) return
  
  pulling.value = true
  pullProgress.value = 0
  pullStatus.value = ''
  pullError.value = ''
  
  try {
    await pullModel(
      pullModelName.value,
      false,
      (data) => {
        if (data.error) {
          pullError.value = data.error
          pulling.value = false
          return
        }
        
        pullStatus.value = data.status || ''
        
        if (data.total && data.completed) {
          pullProgress.value = Math.round((data.completed / data.total) * 100)
        }
        
        if (data.status === 'success') {
          pullProgress.value = 100
          ElMessage.success(t('models.pullSuccess'))
          setTimeout(() => {
            emit('update:pullDialogVisible', false)
            emit('pull-success')
            pullModelName.value = ''
          }, 1000)
        }
      }
    )
  } catch (error) {
    console.error('Pull model error:', error)
    pullError.value = error.message || t('models.pullFailed')
  } finally {
    pulling.value = false
  }
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
</script>

<style scoped>
.pull-progress {
  margin-top: 16px;
}

.progress-status {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.details-content {
  padding: 0 10px;
}

.details-section {
  margin-bottom: 24px;
}

.details-section h4 {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.details-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.details-item.full-width {
  grid-column: span 2;
}

.item-label {
  font-size: 12px;
  color: #999;
}

.item-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  word-break: break-all;
}

.digest-code {
  display: block;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
  color: #666;
  word-break: break-all;
  line-height: 1.4;
}
</style>
