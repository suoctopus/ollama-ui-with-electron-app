<template>
  <Layout>
    <div class="settings-view">
      <!-- Global Search Box Teleported to Layout Header -->
      <Teleport to="#global-search" v-if="mounted">
        <el-input
          v-model="searchQuery"
          :placeholder="$t('settings.search')"
          :prefix-icon="SearchIcon"
          clearable
          style="width: 200px"
          size="small"
        />
      </Teleport>
      
      <div class="settings-container">
        <!-- Left Sidebar -->
        <SettingsSidebar
          v-model:activeTab="activeTab"
        />

        <!-- Main Content -->
        <div class="settings-main">
          <!-- Toolbar -->
          <Toolbar>
            <template #left>
              <el-button-group>
                <el-button 
                  :type="activeTab === 'general' ? 'primary' : 'default'"
                  @click="activeTab = 'general'"
                  size="small"
                >
                  {{ $t('settings.general') }}
                </el-button>
                <el-button 
                  :type="activeTab === 'advanced' ? 'primary' : 'default'"
                  @click="activeTab = 'advanced'"
                  size="small"
                >
                  {{ $t('settings.advancedSettings') }}
                </el-button>
              </el-button-group>
            </template>
          </Toolbar>

          <div class="settings-content">
            <!-- General Settings -->
            <GeneralSettings
              v-show="activeTab === 'general'"
              :local-settings="localSettings"
              :testing="testing"
              :connection-status="connectionStatus"
              @test-connection="handleTestConnection"
              @reset-key="handleResetKey"
            />
          
            <!-- Advanced Settings -->
            <AdvancedSettings
              v-show="activeTab === 'advanced'"
              :local-settings="localSettings"
              v-model:isKeepAlivePermanent="isKeepAlivePermanent"
              @reset-key="handleResetKey"
            />
           
            <!-- Actions -->
            <div class="settings-actions">
              <el-button @click="handleReset">
                {{ $t('settings.reset') }}
              </el-button>
              <el-button type="primary" @click="handleSave">
                {{ $t('settings.save') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/store/settings'
import { testConnection } from '@/api/ollama'
import Layout from '@/components/Layout.vue'
import SettingsSidebar from '@/components/settings/SettingsSidebar.vue'
import GeneralSettings from '@/components/settings/GeneralSettings.vue'
import AdvancedSettings from '@/components/settings/AdvancedSettings.vue'
import Toolbar from '@/components/common/Toolbar.vue'
import { Search as SearchIcon } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const { locale, t } = useI18n()
const settingsStore = useSettingsStore()

const activeTab = ref('general')
const testing = ref(false)
const connectionStatus = ref(null)
const mounted = ref(false)
const searchQuery = ref('')

const localSettings = reactive({
  ollamaUrl: '',
  language: '',
  fontSize: 14,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxTokens: 2048,
  seed: -1,
  numPredict: 128,
  minP: 0.0,
  typicalP: 1.0,
  repeatLastN: 64,
  repeatPenalty: 1.1,
  presencePenalty: 0.0,
  frequencyPenalty: 0.0,
  numCtx: 2048,
  numKeep: 5,
  numGpu: -1,
  numThread: 0,
  keepAlive: '5m',
  systemPrompt: '',
})

const isKeepAlivePermanent = ref(false)

const loadSettings = () => {
  localSettings.ollamaUrl = settingsStore.ollamaUrl
  localSettings.language = settingsStore.language
  localSettings.fontSize = settingsStore.fontSize
  localSettings.temperature = settingsStore.temperature
  localSettings.topP = settingsStore.topP
  localSettings.topK = settingsStore.topK
  localSettings.maxTokens = settingsStore.maxTokens
  localSettings.seed = settingsStore.seed
  localSettings.numPredict = settingsStore.numPredict
  localSettings.minP = settingsStore.minP
  localSettings.typicalP = settingsStore.typicalP
  localSettings.repeatLastN = settingsStore.repeatLastN
  localSettings.repeatPenalty = settingsStore.repeatPenalty
  localSettings.presencePenalty = settingsStore.presencePenalty
  localSettings.frequencyPenalty = settingsStore.frequencyPenalty
  localSettings.numCtx = settingsStore.numCtx
  localSettings.numKeep = settingsStore.numKeep
  localSettings.numGpu = settingsStore.numGpu
  localSettings.numThread = settingsStore.numThread
  localSettings.keepAlive = settingsStore.keepAlive
  localSettings.systemPrompt = settingsStore.systemPrompt
  
  // Sync switch state
  isKeepAlivePermanent.value = localSettings.keepAlive === '-1'
}

watch(isKeepAlivePermanent, (val) => {
  if (val) {
    localSettings.keepAlive = '-1'
  } else {
    // If switching back from permanent, default to 5m if it was -1, otherwise keep current
    if (localSettings.keepAlive === '-1') {
      localSettings.keepAlive = '5m'
    }
  }
})

watch(() => localSettings.language, (newLang) => {
  locale.value = newLang
})

const handleTestConnection = async () => {
  testing.value = true
  connectionStatus.value = null
  
  try {
    const oldUrl = settingsStore.ollamaUrl
    settingsStore.setOllamaUrl(localSettings.ollamaUrl)
    
    const result = await testConnection()
    connectionStatus.value = result
    
    if (!result) {
      settingsStore.setOllamaUrl(oldUrl)
    }
  } catch (error) {
    console.error('Test connection error:', error)
    connectionStatus.value = false
  } finally {
    testing.value = false
  }
}

const handleSave = () => {
  settingsStore.setOllamaUrl(localSettings.ollamaUrl)
  settingsStore.setLanguage(localSettings.language)
  settingsStore.setFontSize(localSettings.fontSize)
  settingsStore.updateAdvancedSettings({
    temperature: localSettings.temperature,
    topP: localSettings.topP,
    topK: localSettings.topK,
    maxTokens: localSettings.maxTokens,
    seed: localSettings.seed,
    numPredict: localSettings.numPredict,
    minP: localSettings.minP,
    typicalP: localSettings.typicalP,
    repeatLastN: localSettings.repeatLastN,
    repeatPenalty: localSettings.repeatPenalty,
    presencePenalty: localSettings.presencePenalty,
    frequencyPenalty: localSettings.frequencyPenalty,
    numCtx: localSettings.numCtx,
    numKeep: localSettings.numKeep,
    numGpu: localSettings.numGpu,
    numThread: localSettings.numThread,
    keepAlive: localSettings.keepAlive,
    systemPrompt: localSettings.systemPrompt,
  })
  
  ElMessage.success(t('settings.saved'))
}

const handleReset = () => {
  settingsStore.reset()
  loadSettings()
  ElMessage.success(t('settings.resetSuccess'))
}

const handleResetKey = (key) => {
  settingsStore.resetKey(key)
  loadSettings()
}

onMounted(() => {
  mounted.value = true
  loadSettings()
})
</script>

<style scoped>
.settings-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  overflow: hidden;
}

.settings-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Main Content */
.settings-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.settings-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
  width: 100%;
  max-width: 900px;
}
</style>