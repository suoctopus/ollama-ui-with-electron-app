<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="对话设置"
    width="560px"
    :close-on-click-modal="true"
    class="settings-dialog"
  >
    <div class="settings-dialog-content">
      <!-- 基础参数 -->
      <div class="param-section">
        <h4 class="section-title">基础参数</h4>
        
        <!-- Temperature -->
        <div class="param-item">
          <div class="param-header">
            <span class="param-name">Temperature (温度)</span>
            <div class="param-controls">
              <span class="param-value">{{ settings.temperature }}</span>
              <el-button link :icon="RotateCcw" @click="$emit('reset-param', 'temperature')" title="恢复默认" />
            </div>
          </div>
          <el-slider 
            :model-value="settings.temperature"
            @update:model-value="updateSetting('temperature', $event)"
            :min="0" 
            :max="2" 
            :step="0.1" 
          />
          <div class="param-hint">控制生成的随机性。值越低输出越确定，值越高输出越随机、更有创意。推荐值：0.7</div>
        </div>
        
        <!-- Top P -->
        <div class="param-item">
          <div class="param-header">
            <span class="param-name">Top P (核采样)</span>
            <div class="param-controls">
              <span class="param-value">{{ settings.top_p }}</span>
              <el-button link :icon="RotateCcw" @click="$emit('reset-param', 'top_p')" title="恢复默认" />
            </div>
          </div>
          <el-slider 
            :model-value="settings.top_p"
            @update:model-value="updateSetting('top_p', $event)"
            :min="0" 
            :max="1" 
            :step="0.05" 
          />
          <div class="param-hint">只考虑累积概率达到此值的词。值越小输出越集中，值越大选择越多样。推荐值：0.9</div>
        </div>
        
        <!-- Top K -->
        <div class="param-item">
          <div class="param-header">
            <span class="param-name">Top K (候选词数)</span>
            <div class="param-controls">
              <span class="param-value">{{ settings.top_k }}</span>
              <el-button link :icon="RotateCcw" @click="$emit('reset-param', 'top_k')" title="恢复默认" />
            </div>
          </div>
          <el-slider 
            :model-value="settings.top_k"
            @update:model-value="updateSetting('top_k', $event)"
            :min="1" 
            :max="100" 
            :step="1" 
          />
          <div class="param-hint">每步只考虑概率最高的K个词。值越小输出越保守，值越大选择越多。推荐值：40</div>
        </div>
      </div>

      <!-- 高级参数 -->
      <div class="param-section">
        <h4 class="section-title">高级参数</h4>
        
        <!-- Seed -->
        <div class="param-item">
          <div class="param-header">
            <span class="param-name">Seed (随机种子)</span>
            <div class="param-controls">
              <el-input-number 
                :model-value="settings.seed"
                @update:model-value="updateSetting('seed', $event)"
                :min="-1"
                size="small"
                style="width: 120px"
              />
              <el-button link :icon="RotateCcw" @click="$emit('reset-param', 'seed')" title="恢复默认" />
            </div>
          </div>
          <div class="param-hint">设置固定种子可获得可复现的输出。-1表示每次随机生成。</div>
        </div>

        <!-- Num Predict -->
        <div class="param-item">
          <div class="param-header">
            <span class="param-name">Num Predict (最大生成数)</span>
            <div class="param-controls">
              <el-input-number 
                :model-value="settings.num_predict"
                @update:model-value="updateSetting('num_predict', $event)"
                :min="-1"
                :max="8192"
                size="small"
                style="width: 120px"
              />
              <el-button link :icon="RotateCcw" @click="$emit('reset-param', 'num_predict')" title="恢复默认" />
            </div>
          </div>
          <div class="param-hint">限制生成的最大token数。-1表示无限制（直到模型自然停止）。</div>
        </div>

        <!-- Repeat Penalty -->
        <div class="param-item">
          <div class="param-header">
            <span class="param-name">Repeat Penalty (重复惩罚)</span>
            <div class="param-controls">
              <span class="param-value">{{ settings.repeat_penalty }}</span>
              <el-button link :icon="RotateCcw" @click="$emit('reset-param', 'repeat_penalty')" title="恢复默认" />
            </div>
          </div>
          <el-slider 
            :model-value="settings.repeat_penalty"
            @update:model-value="updateSetting('repeat_penalty', $event)"
            :min="1" 
            :max="2" 
            :step="0.05" 
          />
          <div class="param-hint">惩罚重复的内容。值越高，模型越倾向于生成不重复的内容。推荐值：1.1</div>
        </div>

        <!-- Context Length -->
        <div class="param-item">
          <div class="param-header">
            <span class="param-name">Context Length (上下文长度)</span>
            <div class="param-controls">
              <el-input-number 
                :model-value="settings.num_ctx"
                @update:model-value="updateSetting('num_ctx', $event)"
                :min="512"
                :max="131072"
                :step="512"
                size="small"
                style="width: 120px"
              />
              <el-button link :icon="RotateCcw" @click="$emit('reset-param', 'num_ctx')" title="恢复默认" />
            </div>
          </div>
          <div class="param-hint">上下文窗口大小。值越大能记住更多历史，但消耗更多内存。推荐值：2048-4096</div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('reset-all')">全部恢复默认</el-button>
        <el-button type="primary" @click="$emit('confirm')">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { RotateCcw } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'update:modelValue',
  'update:settings',
  'reset-param',
  'reset-all',
  'confirm'
])

const updateSetting = (key, value) => {
  emit('update:settings', { ...props.settings, [key]: value })
}
</script>

<style scoped>
/* Settings Dialog Improved */
.settings-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.settings-dialog-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px 24px;
}

.param-section {
  margin-bottom: 24px;
}

.param-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.param-item {
  margin-bottom: 20px;
}

.param-item:last-child {
  margin-bottom: 0;
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.param-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.param-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.param-value {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: #409eff;
  background: #f0f7ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.param-hint {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
