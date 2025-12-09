import { ref } from 'vue'
import { useI18n } from '@/composables/core/useI18n'
import { Wifi, RotateCcw } from 'lucide-vue-next'

export function useGeneralSettings(props, emit) {
  const { t } = useI18n()

  const handleTestConnection = () => {
    emit('test-connection')
  }

  const handleResetKey = (key) => {
    emit('reset-key', key)
  }

  const handleReset = () => {
    emit('reset')
  }

  const handleSave = () => {
    emit('save')
  }

  return {
    // Methods
    handleTestConnection,
    handleResetKey,
    handleReset,
    handleSave,

    // Utils
    t,

    // Icons
    Wifi,
    RotateCcw
  }
}
