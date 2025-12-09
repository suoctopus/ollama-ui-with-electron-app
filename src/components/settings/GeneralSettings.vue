<template>
  <div class="settings-card">
    <div class="settings-section" id="connection">
      <h3>{{ t('settings.connection') }}</h3>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">{{ t('settings.ollamaUrl') }}</span>
          <span class="setting-desc">Ollama API 服务器地址</span>
        </div>
        <div class="setting-control wide">
          <el-input
            v-model="localSettings.ollamaUrl"
            :placeholder="t('settings.ollamaUrlPlaceholder')"
          />
          <div class="control-actions">
            <el-button
              link
              @click="handleTestConnection"
              :loading="testing"
              :icon="Wifi"
            >
              {{ t('settings.testConnection') }}
            </el-button>
            <span v-if="connectionStatus !== null" :class="connectionStatus ? 'status-success' : 'status-error'">
              {{ connectionStatus ? t('settings.connected') : t('settings.disconnected') }}
            </span>
            <el-button link :icon="RotateCcw" @click="handleResetKey('ollamaUrl')" title="恢复默认" />
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section general-settings" id="appearance">
      <h3>{{ t('settings.appearance') }}</h3>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">{{ t('settings.language') }}</span>
          <span class="setting-desc">界面显示语言</span>
        </div>
        <div class="setting-control">
          <el-select v-model="localSettings.language" style="width: 160px">
            <el-option label="中文" value="zh-CN" />
            <el-option label="English" value="en-US" />
          </el-select>
          <el-button link :icon="RotateCcw" @click="handleResetKey('language')" title="恢复默认" />
        </div>
      </div>
      
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-label">{{ t('settings.fontSize') }}</span>
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
          <el-button link :icon="RotateCcw" @click="handleResetKey('fontSize')" title="恢复默认" />
        </div>
      </div>
    </div>

    <!-- Action buttons inside the card -->
    <div class="settings-actions">
      <el-button @click="handleReset">
        {{ t('settings.reset') }}
      </el-button>
      <el-button type="primary" @click="handleSave">
        {{ t('settings.save') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { useGeneralSettings } from '@/composables/settings/useGeneralSettings'

export default {
  props: {
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
  },
  emits: ['test-connection', 'reset-key', 'reset', 'save'],
  setup(props, { emit }) {
    return useGeneralSettings(props, emit)
  }
}
</script>
