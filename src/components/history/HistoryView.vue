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
          style="width: 150px"
          size="small"
        />
      </Teleport>

      <div class="history-container">
        <!-- Left Sidebar - History Categories -->
        <HistorySidebar
          :categories="categories"
          v-model="currentCategory"
          :all-sessions-count="allSessions.length"
          :uncategorized-sessions-count="uncategorizedSessions.length"
          @add-category="showAddCategoryDialog = true"
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
        v-model:addCategoryDialogVisible="showAddCategoryDialog"
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

<script>
import { useHistoryView } from '@/composables/history/useHistoryView'
import Layout from '@/components/Layout.vue'
import HistorySidebar from '@/components/history/HistorySidebar.vue'
import HistoryToolbar from '@/components/history/HistoryToolbar.vue'
import SessionList from '@/components/history/SessionList.vue'
import HistoryModals from '@/components/history/HistoryModals.vue'

export default {
  components: {
    Layout,
    HistorySidebar,
    HistoryToolbar,
    SessionList,
    HistoryModals
  },
  setup() {
    return useHistoryView()
  }
}
</script>
