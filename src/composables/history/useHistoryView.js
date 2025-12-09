import { ref, computed, onMounted } from 'vue'
import { useRouter } from '@/composables/core/useRouter'
import { useChatState } from '@/composables/core/useState'
import { useI18n } from '@/composables/core/useI18n'
import { Search } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useHistoryView() {
  const { t } = useI18n()
  const { push } = useRouter()
  const chatState = useChatState()

  const searchQuery = ref('')
  const selectedSessions = ref([])
  const currentCategory = ref('all') // 'all', 'uncategorized', or specific category name
  const mounted = ref(false)

  const renameDialogVisible = ref(false)
  const categoryDialogVisible = ref(false)
  const showAddCategoryDialog = ref(false)
  const currentEditingSession = ref(null)
  const newTitle = ref('')
  const newCategory = ref('')
  const newCategoryName = ref('')

  onMounted(() => {
    mounted.value = true
  })

  const currentSessionId = computed(() => chatState.currentSessionId.value)
  const categories = computed(() => chatState.categories.value)
  const allSessions = computed(() => chatState.sessions.value)
  const uncategorizedSessions = computed(() => 
    chatState.sessions.value.filter(s => !s.category)
  )

  const filteredSessions = computed(() => {
    let sessions = chatState.sessions.value

    // 1. Filter by Category
    if (currentCategory.value === 'uncategorized') {
      sessions = sessions.filter(s => !s.category)
    } else if (currentCategory.value !== 'all') {
      sessions = sessions.filter(s => s.category === currentCategory.value)
    }

    // 2. Filter by Search Query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      sessions = sessions.filter(session => {
        return (
          session.title.toLowerCase().includes(query) ||
          (session.model && session.model.toLowerCase().includes(query)) ||
          (session.category && session.category.toLowerCase().includes(query)) ||
          session.messages.some(m => m.content.toLowerCase().includes(query))
        )
      })
    }
    
    return sessions
  })

  const handleSelectSession = (session) => {
    chatState.setCurrentSession(session.id)
    push('/chat')
  }

  const handleDeleteSession = async (session) => {
    try {
      await ElMessageBox.confirm(
        t('models.confirmDeleteMsg', { name: session.title }),
        t('common.warning'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
        }
      )
      
      chatState.deleteSession(session.id)
      ElMessage.success(t('common.success'))
    } catch {
      // Cancelled
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await ElMessageBox.confirm(
        t('history.confirmDeleteSelected', { count: selectedSessions.value.length }),
        t('common.warning'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
        }
      )
      
      chatState.deleteSessions(selectedSessions.value)
      selectedSessions.value = []
      ElMessage.success(t('common.success'))
    } catch {
      // Cancelled
    }
  }

  const handleRename = (session) => {
    currentEditingSession.value = session
    newTitle.value = session.title
    renameDialogVisible.value = true
  }

  const confirmRename = () => {
    if (currentEditingSession.value && newTitle.value.trim()) {
      chatState.renameSession(currentEditingSession.value.id, newTitle.value.trim())
      renameDialogVisible.value = false
      ElMessage.success(t('common.success'))
    }
  }

  const handleCategory = (session) => {
    currentEditingSession.value = session
    newCategory.value = session.category || ''
    categoryDialogVisible.value = true
  }

  const confirmCategory = () => {
    if (currentEditingSession.value) {
      // If new category doesn't exist in store, add it
      if (newCategory.value && !chatState.categories.value.includes(newCategory.value)) {
        chatState.addCategory(newCategory.value)
      }
      chatState.setSessionCategory(currentEditingSession.value.id, newCategory.value.trim())
      categoryDialogVisible.value = false
      ElMessage.success(t('common.success'))
    }
  }

  const confirmAddCategory = () => {
    if (newCategoryName.value.trim()) {
      chatState.addCategory(newCategoryName.value.trim())
      showAddCategoryDialog.value = false
      ElMessage.success(t('common.success'))
    }
  }

  const handleDeleteCategory = async (categoryName) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除分类 "${categoryName}" 吗？该分类下的会话将变为未分类。`,
        t('common.warning'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
        }
      )
      
      chatState.deleteCategory(categoryName)
      if (currentCategory.value === categoryName) {
        currentCategory.value = 'all'
      }
      ElMessage.success(t('common.success'))
    } catch {
      // Cancelled
    }
  }

  return {
    // Icons
    Search,
    
    // State
    searchQuery,
    selectedSessions,
    currentCategory,
    mounted,
    renameDialogVisible,
    categoryDialogVisible,
    showAddCategoryDialog,
    newTitle,
    newCategory,
    newCategoryName,
    
    // Computed
    currentSessionId,
    categories,
    allSessions,
    uncategorizedSessions,
    filteredSessions,
    
    // Methods
    handleSelectSession,
    handleDeleteSession,
    handleDeleteSelected,
    handleRename,
    confirmRename,
    handleCategory,
    confirmCategory,
    confirmAddCategory,
    handleDeleteCategory
  }
}
