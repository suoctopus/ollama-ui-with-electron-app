import { ref } from 'vue'
import { useI18n } from '@/composables/core/useI18n'
import { useApi } from '@/composables/common/useApi'
import { useStream } from '@/composables/common/useStream'
import { formatFileSize } from '@/utils/format/size'
import { ElMessage } from 'element-plus'

export function useModelModals(props, emit) {
  const { t } = useI18n()
  const { request } = useApi()
  const { processStream } = useStream()
  
  // Pull model state
  const pullModelName = ref('')
  const pulling = ref(false)
  const pullProgress = ref(0)
  const pullStatus = ref('')
  const pullError = ref('')
  
  // Pull model handler
  const handlePullModel = async () => {
    if (!pullModelName.value.trim()) return
    
    pulling.value = true
    pullProgress.value = 0
    pullStatus.value = ''
    pullError.value = ''
    
    try {
      const response = await request('/api/pull', {
        method: 'POST',
        body: JSON.stringify({
          model: pullModelName.value,
          stream: true
        })
      })
      
      await processStream(response, (data) => {
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
      })
    } catch (error) {
      console.error('Pull model error:', error)
      pullError.value = error.message || t('models.pullFailed')
    } finally {
      pulling.value = false
    }
  }
  
  // Format size helper
  const formatSize = (bytes) => {
    return formatFileSize(bytes)
  }
  
  // Format date helper
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
  
  return {
    // Pull model state
    pullModelName,
    pulling,
    pullProgress,
    pullStatus,
    pullError,
    
    // Methods
    handlePullModel,
    formatSize,
    formatDate,
    
    // Utilities
    t
  }
}
