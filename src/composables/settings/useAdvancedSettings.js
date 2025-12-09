import { useI18n } from '@/composables/core/useI18n'
import { RotateCcw } from 'lucide-vue-next'

export function useAdvancedSettings(props, emit) {
  const { t } = useI18n()

  const handleResetKey = (key) => {
    emit('reset-key', key)
  }

  const handleUpdateKeepAlive = (value) => {
    emit('update:isKeepAlivePermanent', value)
  }

  const handleReset = () => {
    emit('reset')
  }

  const handleSave = () => {
    emit('save')
  }

  return {
    // Methods
    handleResetKey,
    handleUpdateKeepAlive,
    handleReset,
    handleSave,

    // Utils
    t,

    // Icons
    RotateCcw
  }
}
