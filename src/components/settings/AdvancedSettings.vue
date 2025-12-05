<template>
  <div class="settings-card">
    <!-- Basic Generation -->
    <div class="settings-section" id="basic-generation">
      <h3>基础生成参数</h3>
      <p class="section-desc">这些参数控制模型生成文本时的行为，适用于所有新对话。</p>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Temperature (温度)</span>
          <span class="setting-desc">控制生成的随机性。0=最确定，2=最随机。推荐：0.7</span>
        </div>
        <div class="setting-control">
          <el-slider v-model="localSettings.temperature" :min="0" :max="2" :step="0.1" style="width: 180px" />
          <span class="value-display">{{ localSettings.temperature }}</span>
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'temperature')" title="恢复默认" />
        </div>
      </div>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Top P (核采样)</span>
          <span class="setting-desc">只考虑累积概率达到此值的词。值越小输出越集中。推荐：0.9</span>
        </div>
        <div class="setting-control">
          <el-slider v-model="localSettings.topP" :min="0" :max="1" :step="0.05" style="width: 180px" />
          <span class="value-display">{{ localSettings.topP }}</span>
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'topP')" title="恢复默认" />
        </div>
      </div>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Top K (候选词数)</span>
          <span class="setting-desc">每步只考虑概率最高的K个词。值越小输出越保守。推荐：40</span>
        </div>
        <div class="setting-control">
          <el-slider v-model="localSettings.topK" :min="1" :max="100" :step="1" style="width: 180px" />
          <span class="value-display">{{ localSettings.topK }}</span>
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'topK')" title="恢复默认" />
        </div>
      </div>
    </div>

    <!-- Sampling Parameters -->
    <div class="settings-section" id="sampling">
      <h3>采样参数</h3>
      <p class="section-desc">控制采样过程的高级参数。</p>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Seed (随机种子)</span>
          <span class="setting-desc">固定种子可获得可复现的输出。-1=每次随机</span>
        </div>
        <div class="setting-control">
          <el-input-number v-model="localSettings.seed" :min="-1" style="width: 140px" />
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'seed')" title="恢复默认" />
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Num Predict (最大生成数)</span>
          <span class="setting-desc">限制生成的最大token数。-1=无限制</span>
        </div>
        <div class="setting-control">
          <el-input-number v-model="localSettings.numPredict" :min="-1" :max="8192" :step="64" style="width: 140px" />
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'numPredict')" title="恢复默认" />
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Min P (最小概率)</span>
          <span class="setting-desc">过滤掉概率低于此阈值的词。0=不过滤</span>
        </div>
        <div class="setting-control">
          <el-slider v-model="localSettings.minP" :min="0" :max="1" :step="0.05" style="width: 180px" />
          <span class="value-display">{{ localSettings.minP }}</span>
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'minP')" title="恢复默认" />
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Typical P (典型采样)</span>
          <span class="setting-desc">选择最"典型"的词。1=禁用此功能</span>
        </div>
        <div class="setting-control">
          <el-slider v-model="localSettings.typicalP" :min="0" :max="1" :step="0.05" style="width: 180px" />
          <span class="value-display">{{ localSettings.typicalP }}</span>
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'typicalP')" title="恢复默认" />
        </div>
      </div>
    </div>

    <!-- Repetition Penalty -->
    <div class="settings-section" id="repetition">
      <h3>重复惩罚参数</h3>
      <p class="section-desc">防止模型重复生成相同或相似的内容。</p>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Repeat Last N (检测范围)</span>
          <span class="setting-desc">检测最近N个token中的重复。0=禁用</span>
        </div>
        <div class="setting-control">
          <el-input-number v-model="localSettings.repeatLastN" :min="0" :max="2048" :step="8" style="width: 140px" />
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'repeatLastN')" title="恢复默认" />
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Repeat Penalty (重复惩罚系数)</span>
          <span class="setting-desc">惩罚重复内容的程度。1=不惩罚，越高惩罚越重。推荐：1.1</span>
        </div>
        <div class="setting-control">
          <el-slider v-model="localSettings.repeatPenalty" :min="1" :max="2" :step="0.05" style="width: 180px" />
          <span class="value-display">{{ localSettings.repeatPenalty }}</span>
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'repeatPenalty')" title="恢复默认" />
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Presence Penalty (存在惩罚)</span>
          <span class="setting-desc">鼓励讨论新话题。0=不惩罚</span>
        </div>
        <div class="setting-control">
          <el-slider v-model="localSettings.presencePenalty" :min="0" :max="2" :step="0.1" style="width: 180px" />
          <span class="value-display">{{ localSettings.presencePenalty }}</span>
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'presencePenalty')" title="恢复默认" />
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Frequency Penalty (频率惩罚)</span>
          <span class="setting-desc">减少重复使用相同词语。0=不惩罚</span>
        </div>
        <div class="setting-control">
          <el-slider v-model="localSettings.frequencyPenalty" :min="0" :max="2" :step="0.1" style="width: 180px" />
          <span class="value-display">{{ localSettings.frequencyPenalty }}</span>
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'frequencyPenalty')" title="恢复默认" />
        </div>
      </div>
    </div>

    <!-- Context Parameters -->
    <div class="settings-section" id="context">
      <h3>上下文参数</h3>
      <p class="section-desc">控制模型的上下文记忆能力。</p>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Context Length (上下文长度)</span>
          <span class="setting-desc">上下文窗口大小。值越大能记住更多历史，但消耗更多内存</span>
        </div>
        <div class="setting-control">
          <el-input-number v-model="localSettings.numCtx" :min="512" :max="131072" :step="512" style="width: 140px" />
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'numCtx')" title="恢复默认" />
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Num Keep (保留token数)</span>
          <span class="setting-desc">始终保留在上下文开头的token数量</span>
        </div>
        <div class="setting-control">
          <el-input-number v-model="localSettings.numKeep" :min="0" :max="100" style="width: 140px" />
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'numKeep')" title="恢复默认" />
        </div>
      </div>
    </div>

    <!-- Hardware Parameters -->
    <div class="settings-section" id="hardware">
      <h3>硬件参数</h3>
      <p class="section-desc">控制模型使用的硬件资源。修改后需要重新加载模型才能生效。</p>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">GPU Layers (GPU层数)</span>
          <span class="setting-desc">加载到GPU的层数。-1=全部，0=仅CPU</span>
        </div>
        <div class="setting-control">
          <el-input-number v-model="localSettings.numGpu" :min="-1" :max="999" style="width: 140px" />
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'numGpu')" title="恢复默认" />
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">CPU Threads (CPU线程数)</span>
          <span class="setting-desc">推理时使用的CPU线程数。0=自动检测</span>
        </div>
        <div class="setting-control">
          <el-input-number v-model="localSettings.numThread" :min="0" :max="64" style="width: 140px" />
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'numThread')" title="恢复默认" />
        </div>
      </div>
    </div>

    <!-- Other Parameters -->
    <div class="settings-section" id="other">
      <h3>其他参数</h3>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">Keep Alive (保持时间)</span>
          <span class="setting-desc">模型在内存中保持的时间。开启永久则不会自动卸载。</span>
        </div>
        <div class="setting-control">
          <div class="keep-alive-control">
            <el-switch
              :model-value="isKeepAlivePermanent"
              active-text="永久"
              inactive-text="自定义"
              inline-prompt
              @change="$emit('update:isKeepAlivePermanent', $event)"
            />
            <el-input 
              v-if="!isKeepAlivePermanent"
              v-model="localSettings.keepAlive" 
              placeholder="5m" 
              style="width: 100px" 
            />
          </div>
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'keepAlive')" title="恢复默认" />
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">System Prompt (系统提示词)</span>
          <span class="setting-desc">全局系统提示词，会应用到所有新对话的开头</span>
        </div>
        <div class="setting-control">
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'systemPrompt')" title="恢复默认" />
        </div>
      </div>
      <div class="setting-row-full">
        <el-input
          v-model="localSettings.systemPrompt"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 8 }"
          resize="none"
          placeholder="输入系统提示词..."
        />
      </div>
    </div>

    <!-- Action buttons inside the card -->
    <div class="settings-actions">
      <el-button @click="$emit('reset')">
        {{ $t('settings.reset') }}
      </el-button>
      <el-button type="primary" @click="$emit('save')">
        {{ $t('settings.save') }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { RotateCcw } from 'lucide-vue-next'

defineProps({
  localSettings: {
    type: Object,
    required: true
  },
  isKeepAlivePermanent: {
    type: Boolean,
    default: false
  }
})

defineEmits(['reset-key', 'update:isKeepAlivePermanent', 'reset', 'save'])
</script>

<style scoped>
.settings-card {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-height: fit-content;
  height: auto;
}

.settings-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.settings-section h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.section-desc {
  margin: 0 0 20px 0;
  font-size: 13px;
  color: #999;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #fafafa;
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-row-full {
  padding: 12px 0;
  width: 100%;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.setting-desc {
  font-size: 12px;
  color: #999;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.value-display {
  min-width: 48px;
  text-align: center;
  font-weight: 600;
  color: #409eff;
  background: #f0f7ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
}

.keep-alive-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
  width: 100%;
}
</style>
