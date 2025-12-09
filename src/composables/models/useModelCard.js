import { computed } from 'vue'
import { useModels } from '@/composables/core/useState'
import { useI18n } from '@/composables/core/useI18n'
import { formatFileSize } from '@/utils/format/size'
import { Box, PlayCircle, StopCircle, Info, Trash2 } from 'lucide-vue-next'
import { Loading } from '@element-plus/icons-vue'

export function useModelCard(props, emit) {
  const { t } = useI18n()
  const modelState = useModels()

  // Check if model is running
  const isRunning = (modelName) => {
    return modelState.isModelRunning(modelName)
  }

  // Check if model is loading
  const isModelLoading = (modelName) => {
    return modelState.isModelLoading(modelName)
  }

  // Format file size
  const formatSize = (bytes) => {
    return formatFileSize(bytes)
  }

  // Format date
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

  // Keep alive settings
  const getKeepAlivePermanent = (name) => {
    return modelState.modelKeepAliveSettings.value[name] === '-1s'
  }

  const setKeepAlivePermanent = (name, isPerm) => {
    if (isPerm) {
      modelState.setModelKeepAlive(name, '-1s')
    } else {
      modelState.setModelKeepAlive(name, '5m')
    }
  }

  const getKeepAliveDuration = (name) => {
    const val = modelState.modelKeepAliveSettings.value[name]
    if (val === '-1s') return '-1s'
    return val || '5m'
  }

  const setKeepAliveDuration = (name, val) => {
    if (val && val.trim() !== '') {
      modelState.setModelKeepAlive(name, val.trim())
    }
  }

  // Event handlers
  const handleLoad = () => {
    emit('load', props.model)
  }

  const handleUnload = () => {
    emit('unload', props.model)
  }

  const handleShowDetails = () => {
    emit('show-details', props.model)
  }

  const handleDelete = () => {
    emit('delete', props.model)
  }

  return {
    // State
    t,
    
    // Methods
    isRunning,
    isModelLoading,
    formatSize,
    formatDate,
    getKeepAlivePermanent,
    setKeepAlivePermanent,
    getKeepAliveDuration,
    setKeepAliveDuration,
    handleLoad,
    handleUnload,
    handleShowDetails,
    handleDelete,
    
    // Icons
    Box,
    PlayCircle,
    StopCircle,
    Info,
    Trash2,
    Loading
  }
}