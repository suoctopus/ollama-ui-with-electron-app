<template>
  <div>
    <!-- Pull Model Dialog -->
    <el-dialog
      :model-value="pullDialogVisible"
      @update:model-value="$emit('update:pullDialogVisible', $event)"
      :title="t('models.pullModel')"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item :label="t('models.modelName')">
          <el-input
            v-model="pullModelName"
            :placeholder="t('models.modelNamePlaceholder')"
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
          {{ t('common.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="handlePullModel"
          :loading="pulling"
          :disabled="!pullModelName.trim() || pulling"
        >
          {{ pulling ? t('models.pulling') : t('models.pull') }}
        </el-button>
      </template>
    </el-dialog>
    
    <!-- Model Details Dialog -->
    <el-dialog
      :model-value="detailsDrawerVisible"
      @update:model-value="$emit('update:detailsDrawerVisible', $event)"
      :title="t('models.modelDetails')"
      width="500px"
      align-center
      class="model-details-dialog"
    >
      <div v-if="selectedModel" class="details-content">
        <div class="details-section">
          <h4>{{ t('models.basicInfo') }}</h4>
          <div class="details-grid">
            <div class="details-item">
              <span class="item-label">{{ t('models.name') }}</span>
              <span class="item-value">{{ selectedModel.name }}</span>
            </div>
            <div class="details-item">
              <span class="item-label">{{ t('models.size') }}</span>
              <span class="item-value">{{ formatSize(selectedModel.size) }}</span>
            </div>
            <div class="details-item">
              <span class="item-label">{{ t('models.family') }}</span>
              <span class="item-value">{{ selectedModel.details?.family || '-' }}</span>
            </div>
            <div class="details-item">
              <span class="item-label">{{ t('models.format') }}</span>
              <span class="item-value">{{ selectedModel.details?.format || '-' }}</span>
            </div>
            <div class="details-item">
              <span class="item-label">{{ t('models.parameterSize') }}</span>
              <span class="item-value">{{ selectedModel.details?.parameter_size || '-' }}</span>
            </div>
            <div class="details-item">
              <span class="item-label">{{ t('models.quantization') }}</span>
              <span class="item-value">{{ selectedModel.details?.quantization_level || '-' }}</span>
            </div>
            <div class="details-item full-width">
              <span class="item-label">{{ t('models.modified') }}</span>
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

<script>
import { useModelModals } from '@/composables/models/useModelModals'

export default {
  props: {
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
  },
  emits: ['update:pullDialogVisible', 'update:detailsDrawerVisible', 'pull-success'],
  setup(props, { emit }) {
    return useModelModals(props, emit)
  }
}
</script>
