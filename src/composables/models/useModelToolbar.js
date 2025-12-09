import { computed } from 'vue'
import { useI18n } from '@/composables/core/useI18n'
import { RefreshCw, Download } from 'lucide-vue-next'

export function useModelToolbar(props, emit) {
  const { t } = useI18n()
  
  const leftText = computed(() => {
    return props.filteredModels.length > 0 
      ? t('models.modelCount', { count: props.filteredModels.length }) 
      : ''
  })
  
  const rightButtons = computed(() => [
    {
      props: {
        icon: RefreshCw,
        loading: props.loading,
        size: 'small'
      },
      text: t('models.refresh'),
      handler: () => emit('refresh')
    },
    {
      props: {
        type: 'primary',
        icon: Download,
        size: 'small'
      },
      text: t('models.pull'),
      handler: () => emit('open-pull-dialog')
    }
  ])
  
  return {
    leftText,
    rightButtons
  }
}
