import { computed } from 'vue'
import { useI18n } from '@/composables/core/useI18n'
import { Trash2 } from 'lucide-vue-next'

export function useHistoryToolbar(props, emit) {
  const { t } = useI18n()

  const leftText = computed(() => {
    return props.filteredSessionsCount > 0 
      ? t('history.sessionCount', { count: props.filteredSessionsCount }) 
      : ''
  })

  const rightButtons = computed(() => [
    {
      props: {
        type: 'danger',
        disabled: props.selectedSessionsCount === 0,
        icon: Trash2,
        size: 'small',
        plain: true
      },
      text: t('history.deleteSelected'),
      handler: () => emit('delete-selected')
    }
  ])

  return {
    leftText,
    rightButtons
  }
}
