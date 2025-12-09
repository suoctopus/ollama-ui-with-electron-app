import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useModels } from '@/composables/core/useState'
import { listModels, deleteModel, loadModel, unloadModel, listRunningModels } from '@/composables/common/useOllamaApi'
import { Search } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

export function useModelsView() {
  const { t } = useI18n()
  const modelState = useModels()

  // State
  const loading = ref(false)
  const searchQuery = ref('')
  const pullDialogVisible = ref(false)
  const detailsDrawerVisible = ref(false)
  const selectedModel = ref(null)
  const mounted = ref(false)
  const currentFamily = ref('all')
  let intervalId = null

  // Computed
  const models = computed(() => modelState.models.value || [])

  const filteredModels = computed(() => {
    let result = models.value
    
    // Filter by family
    if (currentFamily.value !== 'all') {
      result = result.filter(m => m.details?.family === currentFamily.value)
    }
    
    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(m => 
        m.name.toLowerCase().includes(query) ||
        (m.details?.family || '').toLowerCase().includes(query)
      )
    }
    
    return result
  })

  // Methods
  const isModelLoading = (modelName) => {
    return modelState.isModelLoading(modelName)
  }

  const loadLocalModels = async () => {
    loading.value = true
    try {
      const data = await listModels()
      modelState.setModels(data.models || [])
    } catch (error) {
      console.error('Failed to load models:', error)
      ElMessage.error(t('models.loadFailed'))
    } finally {
      loading.value = false
    }
  }

  const loadRunningModels = async () => {
    try {
      const data = await listRunningModels()
      modelState.setRunningModels(data.models || [])
    } catch (error) {
      console.error('Failed to load running models:', error)
    }
  }

  const handleLoadModel = async (model) => {
    if (isModelLoading(model.name)) return

    modelState.setModelLoading(model.name, true)
    try {
      const keepAlive = modelState.getModelKeepAlive(model.name)
      const success = await loadModel(model.name, keepAlive)
      if (success) {
        ElMessage.success(t('models.loadSuccess'))
        modelState.updateModelRunningStatus(model.name, true)
        await loadRunningModels()
      } else {
        ElMessage.error(t('models.loadFailed'))
      }
    } catch (error) {
      console.error('Load model error:', error)
      ElMessage.error(t('models.loadFailed'))
    } finally {
      modelState.setModelLoading(model.name, false)
    }
  }

  const handleUnloadModel = async (model) => {
    if (isModelLoading(model.name)) return

    modelState.setModelLoading(model.name, true)
    try {
      const success = await unloadModel(model.name)
      if (success) {
        ElMessage.success(t('models.unloadSuccess'))
        modelState.updateModelRunningStatus(model.name, false)
        await loadRunningModels()
      } else {
        ElMessage.error(t('models.unloadFailed'))
      }
    } catch (error) {
      console.error('Unload model error:', error)
      ElMessage.error(t('models.unloadFailed'))
    } finally {
      modelState.setModelLoading(model.name, false)
    }
  }

  const handleDeleteModel = async (model) => {
    try {
      await ElMessageBox.confirm(
        t('models.deleteConfirm', { name: model.name }),
        t('common.warning'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
        }
      )
      
      const success = await deleteModel(model.name)
      if (success) {
        ElMessage.success(t('models.deleteSuccess'))
        loadLocalModels()
      } else {
        ElMessage.error(t('models.deleteFailed'))
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('Delete model error:', error)
        ElMessage.error(t('models.deleteFailed'))
      }
    }
  }

  const handleShowDetails = (model) => {
    selectedModel.value = model
    detailsDrawerVisible.value = true
  }

  // Lifecycle
  onMounted(() => {
    mounted.value = true
    loadLocalModels()
    loadRunningModels()
    intervalId = setInterval(loadRunningModels, 10000)
  })

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  })

  return {
    // State
    loading,
    searchQuery,
    pullDialogVisible,
    detailsDrawerVisible,
    selectedModel,
    mounted,
    currentFamily,
    models,
    filteredModels,
    
    // Methods
    loadLocalModels,
    handleLoadModel,
    handleUnloadModel,
    handleDeleteModel,
    handleShowDetails,
    
    // Icons
    Search,
    
    // Utils
    t
  }
}
