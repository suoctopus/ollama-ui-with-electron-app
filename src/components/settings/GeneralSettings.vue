<template>
  <div class="settings-card">
    <div class="settings-section" id="connection">
      <h3>{{ $t('settings.connection') }}</h3>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">{{ $t('settings.ollamaUrl') }}</span>
          <span class="setting-desc">Ollama API 服务器地址</span>
        </div>
        <div class="setting-control wide">
          <el-input
            v-model="localSettings.ollamaUrl"
            :placeholder="$t('settings.ollamaUrlPlaceholder')"
          />
          <div class="control-actions">
            <el-button
              link
              @click="$emit('test-connection')"
              :loading="testing"
              :icon="Wifi"
            >
              {{ $t('settings.testConnection') }}
            </el-button>
            <span v-if="connectionStatus !== null" :class="connectionStatus ? 'status-success' : 'status-error'">
              {{ connectionStatus ? $t('settings.connected') : $t('settings.disconnected') }}
            </span>
            <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'ollamaUrl')" title="恢复默认" />
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section general-settings" id="appearance">
      <h3>{{ $t('settings.appearance') }}</h3>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">{{ $t('settings.language') }}</span>
          <span class="setting-desc">界面显示语言</span>
        </div>
        <div class="setting-control">
          <el-select v-model="localSettings.language" style="width: 160px">
            <el-option label="中文" value="zh-CN" />
            <el-option label="English" value="en-US" />
          </el-select>
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'language')" title="恢复默认" />
        </div>
      </div>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">{{ $t('settings.fontSize') }}</span>
          <span class="setting-desc">调整界面文字大小（12-20px）</span>
        </div>
        <div class="setting-control">
          <el-slider
            v-model="localSettings.fontSize"
            :min="12"
            :max="20"
            :step="1"
            show-input
            style="width: 200px"
          />
          <el-button link :icon="RotateCcw" @click="$emit('reset-key', 'fontSize')" title="恢复默认" />
        </div>
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
import { Wifi, RotateCcw } from 'lucide-vue-next'

defineProps({
  localSettings: {
    type: Object,
    required: true
  },
  testing: {
    type: Boolean,
    default: false
  },
  connectionStatus: {
    type: Boolean,
    default: null
  }
})

defineEmits(['test-connection', 'reset-key', 'reset', 'save'])
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

.settings-section.general-settings {
  margin-bottom: 16px;
  padding-bottom: 16px;
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

.setting-control.wide {
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.setting-control.wide .el-input {
  width: 300px;
}

.control-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-success {
  color: #67c23a;
  font-weight: 500;
  font-size: 13px;
}

.status-error {
  color: #f56c6c;
  font-weight: 500;
  font-size: 13px;
}

.settings-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
  width: 100%;
}
</style>
