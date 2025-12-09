import { computed } from 'vue'
import { useI18n } from '@/composables/core/useI18n'
import { LayoutGrid, HelpCircle, Folder, Plus, Trash2 } from 'lucide-vue-next'

export function useHistorySidebar(props, emit) {
  const { t } = useI18n()

  const currentCategory = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  const title = computed(() => t('history.categories'))

  const sidebarItems = computed(() => {
    const items = [
      {
        key: 'all',
        name: t('history.allChats'),
        icon: LayoutGrid,
        count: props.allSessionsCount
      },
      {
        key: 'uncategorized',
        name: t('history.uncategorized'),
        icon: HelpCircle,
        count: props.uncategorizedSessionsCount
      }
    ]
    
    props.categories.forEach(category => {
      items.push({
        key: category,
        name: category,
        icon: Folder,
        actions: [
          {
            icon: Trash2,
            handler: () => emit('delete-category', category)
          }
        ]
      })
    })
    
    return items
  })

  const onSelectCategory = (item) => {
    emit('update:modelValue', item.key)
  }

  return {
    // Icons
    Plus,
    
    // State
    currentCategory,
    title,
    sidebarItems,
    
    // Methods
    onSelectCategory
  }
}
