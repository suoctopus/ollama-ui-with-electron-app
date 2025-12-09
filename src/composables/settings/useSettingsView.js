import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useI18n } from '@/composables/core/useI18n'
import { useSettings } from '@/composables/core/useState'
import { useApi } from '@/composables/common/useApi'
import { Search as SearchIcon } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

export function useSettingsView() {
  const { locale, t } = useI18n()
  const { settings, setOllamaUrl, setLanguage, setFontSize, updateAdvancedSettings, reset, resetKey } = useSettings()
  const { request } = useApi()

  const activeTab = ref('general')
  const currentSection = ref('connection')
  const testing = ref(false)
  const connectionStatus = ref(null)
  const mounted = ref(false)
  const searchQuery = ref('')
  const settingsContent = ref(null)
  const generalSettings = ref(null)
  const advancedSettings = ref(null)

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
    localSettings.ollamaUrl = settings.value.ollamaUrl
    localSettings.language = settings.value.language
    localSettings.fontSize = settings.value.fontSize
    localSettings.temperature = settings.value.temperature
    localSettings.topP = settings.value.topP
    localSettings.topK = settings.value.topK
    localSettings.maxTokens = settings.value.maxTokens
    localSettings.seed = settings.value.seed
    localSettings.numPredict = settings.value.numPredict
    localSettings.minP = settings.value.minP
    localSettings.typicalP = settings.value.typicalP
    localSettings.repeatLastN = settings.value.repeatLastN
    localSettings.repeatPenalty = settings.value.repeatPenalty
    localSettings.presencePenalty = settings.value.presencePenalty
    localSettings.frequencyPenalty = settings.value.frequencyPenalty
    localSettings.numCtx = settings.value.numCtx
    localSettings.numKeep = settings.value.numKeep
    localSettings.numGpu = settings.value.numGpu
    localSettings.numThread = settings.value.numThread
    localSettings.keepAlive = settings.value.keepAlive
    localSettings.systemPrompt = settings.value.systemPrompt
    
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
      const oldUrl = settings.value.ollamaUrl
      setOllamaUrl(localSettings.ollamaUrl)
      
      // Test connection by calling version endpoint
      const response = await request('/api/version')
      const result = response.ok
      connectionStatus.value = result
      
      if (!result) {
        setOllamaUrl(oldUrl)
      }
    } catch (error) {
      console.error('Test connection error:', error)
      connectionStatus.value = false
    } finally {
      testing.value = false
    }
  }

  const handleSave = () => {
    setOllamaUrl(localSettings.ollamaUrl)
    setLanguage(localSettings.language)
    setFontSize(localSettings.fontSize)
    updateAdvancedSettings({
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
    reset()
    loadSettings()
    ElMessage.success(t('settings.resetSuccess'))
  }

  const handleResetKey = (key) => {
    resetKey(key)
    loadSettings()
  }

  const handleScrollTo = async (section) => {
    await nextTick()
    
    let targetElement = null
    
    // Find target element
    switch (section) {
      case 'connection':
        targetElement = document.querySelector('.settings-section:not(.general-settings)')
        break
      case 'appearance':
        targetElement = document.querySelector('.settings-section.general-settings')
        break
      case 'basic-generation':
        targetElement = document.querySelector('.settings-section h3')
        break
      case 'sampling':
        // Find second h3 element (sampling parameters)
        const h3Elements = document.querySelectorAll('.settings-section h3')
        if (h3Elements.length > 1) {
          targetElement = h3Elements[1]
        }
        break
      case 'repetition':
        // Find third h3 element (repetition penalty parameters)
        const h3RepElements = document.querySelectorAll('.settings-section h3')
        if (h3RepElements.length > 2) {
          targetElement = h3RepElements[2]
        }
        break
      case 'context':
        // Find fourth h3 element (context parameters)
        const h3CtxElements = document.querySelectorAll('.settings-section h3')
        if (h3CtxElements.length > 3) {
          targetElement = h3CtxElements[3]
        }
        break
      case 'hardware':
        // Find fifth h3 element (hardware parameters)
        const h3HwElements = document.querySelectorAll('.settings-section h3')
        if (h3HwElements.length > 4) {
          targetElement = h3HwElements[4]
        }
        break
      case 'other':
        // Find last h3 element (other parameters)
        const h3OtherElements = document.querySelectorAll('.settings-section h3')
        if (h3OtherElements.length > 0) {
          targetElement = h3OtherElements[h3OtherElements.length - 1]
        }
        break
    }
    
    if (targetElement && settingsContent.value) {
      const container = settingsContent.value
      const offsetTop = targetElement.offsetTop
      container.scrollTo({
        top: offsetTop - 20,
        behavior: 'smooth'
      })
    }
  }

  onMounted(() => {
    mounted.value = true
    loadSettings()
  })

  return {
    // State
    activeTab,
    currentSection,
    testing,
    connectionStatus,
    mounted,
    searchQuery,
    settingsContent,
    generalSettings,
    advancedSettings,
    localSettings,
    isKeepAlivePermanent,

    // Methods
    handleTestConnection,
    handleSave,
    handleReset,
    handleResetKey,
    handleScrollTo,

    // Utils
    t,

    // Icons
    SearchIcon
  }
}
