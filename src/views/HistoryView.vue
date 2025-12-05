<template>
  <Layout>
    <div class="history-view">
      <!-- Global Search Box Teleported to Layout Header -->
      <Teleport to="#global-search" v-if="mounted">
        <el-input
          v-model="searchQuery"
          :placeholder="$t('history.search')"
          :prefix-icon="Search"
          clearable
          style="width: 200px"
          size="small"
        />
      </Teleport>

      <div class="history-container">
        <!-- Sidebar -->
        <HistorySidebar
          :categories="categories"
          :current-category="currentCategory"
          :all-sessions-count="allSessionsCount"
          :uncategorized-sessions-count="uncategorizedSessionsCount"
          @update:currentCategory="currentCategory = $event"
          @add-category="handleAddCategory"
          @delete-category="handleDeleteCategory"
        />

        <!-- Main Content -->
        <div class="history-main">
          <!-- Toolbar -->
          <HistoryToolbar
            :filtered-sessions-count="filteredSessions.length"
            :selected-sessions-count="selectedSessions.length"
            @delete-selected="handleDeleteSelected"
          />

          <!-- Session List -->
          <SessionList
            :filtered-sessions="filteredSessions"
            :current-session-id="currentSessionId"
            v-model:selectedSessions="selectedSessions"
            @select-session="handleSelectSession"
            @rename-session="handleRename"
            @category-session="handleCategory"
            @delete-session="handleDeleteSession"
          />
        </div>
      </div>

      <!-- Modals -->
      <HistoryModals
        v-model:renameDialogVisible="renameDialogVisible"
        v-model:categoryDialogVisible="categoryDialogVisible"
        v-model:addCategoryDialogVisible="addCategoryDialogVisible"
        v-model:newTitle="newTitle"
        v-model:newCategory="newCategory"
        v-model:newCategoryName="newCategoryName"
        :categories="categories"
        @confirm-rename="confirmRename"
        @confirm-category="confirmCategory"
        @confirm-add-category="confirmAddCategory"
      />
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/store/chat'
import Layout from '@/components/Layout.vue'
import HistorySidebar from '@/components/history/HistorySidebar.vue'
import HistoryToolbar from '@/components/history/HistoryToolbar.vue'
import SessionList from '@/components/history/SessionList.vue'
import HistoryModals from '@/components/history/HistoryModals.vue'
import { Search } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const chatStore = useChatStore()

const searchQuery = ref('')
const selectedSessions = ref([])
const currentCategory = ref('all') // 'all', 'uncategorized', or specific category name
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

const renameDialogVisible = ref(false)
const categoryDialogVisible = ref(false)
const addCategoryDialogVisible = ref(false)
const currentEditingSession = ref(null)
const newTitle = ref('')
const newCategory = ref('')
const newCategoryName = ref('')

const currentSessionId = computed(() => chatStore.currentSessionId)
const categories = computed(() => chatStore.categories)

const allSessionsCount = computed(() => chatStore.sessions.length)
const uncategorizedSessionsCount = computed(() => chatStore.sessions.filter(s => !s.category).length)

const filteredSessions = computed(() => {
  let sessions = chatStore.sessions

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
  chatStore.setCurrentSession(session.id)
  router.push('/chat')
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
    
    chatStore.deleteSession(session.id)
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
    
    chatStore.deleteSessions(selectedSessions.value)
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
    chatStore.renameSession(currentEditingSession.value.id, newTitle.value.trim())
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
    if (newCategory.value && !chatStore.categories.includes(newCategory.value)) {
      chatStore.addCategory(newCategory.value)
    }
    chatStore.setSessionCategory(currentEditingSession.value.id, newCategory.value.trim())
    categoryDialogVisible.value = false
    ElMessage.success(t('common.success'))
  }
}

const handleAddCategory = () => {
  newCategoryName.value = ''
  addCategoryDialogVisible.value = true
}

const confirmAddCategory = () => {
  if (newCategoryName.value.trim()) {
    chatStore.addCategory(newCategoryName.value.trim())
    addCategoryDialogVisible.value = false
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
    
    chatStore.deleteCategory(categoryName)
    if (currentCategory.value === categoryName) {
      currentCategory.value = 'all'
    }
    ElMessage.success(t('common.success'))
  } catch {
    // Cancelled
  }
}
</script>

<style scoped>
.history-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.history-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.history-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
