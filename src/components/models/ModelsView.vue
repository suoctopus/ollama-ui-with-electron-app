<template>
  <Layout>
    <div class="models-view">
      <!-- Global Search Teleport -->
      <Teleport to="#global-search" v-if="mounted">
        <el-input
          v-model="searchQuery"
          :placeholder="t('models.search')"
          :prefix-icon="Search"
          clearable
          style="width: 150px"
          size="small"
        />
      </Teleport>
      
      <div class="models-container">
        <!-- Left Sidebar - Model Categories -->
        <ModelSidebar
          :models="models"
          v-model="currentFamily"
        />

        <!-- Main Content -->
        <div class="models-main">
          <!-- Toolbar -->
          <ModelToolbar
            :filtered-models="filteredModels"
            :loading="loading"
            @refresh="loadLocalModels"
            @open-pull-dialog="pullDialogVisible = true"
          />

          <!-- Models Grid -->
          <ModelList
            :filtered-models="filteredModels"
            :loading="loading"
            :search-query="searchQuery"
            @load="handleLoadModel"
            @unload="handleUnloadModel"
            @delete="handleDeleteModel"
            @show-details="handleShowDetails"
          />
        </div>
      </div>
      
      <!-- Modals -->
      <ModelModals
        v-model:pullDialogVisible="pullDialogVisible"
        v-model:detailsDrawerVisible="detailsDrawerVisible"
        :selected-model="selectedModel"
        @pull-success="loadLocalModels"
      />
    </div>
  </Layout>
</template>

<script>
import { useModelsView } from '@/composables/models/useModelsView'
import Layout from '@/components/Layout.vue'
import ModelSidebar from '@/components/models/ModelSidebar.vue'
import ModelToolbar from '@/components/models/ModelToolbar.vue'
import ModelList from '@/components/models/ModelList.vue'
import ModelModals from '@/components/models/ModelModals.vue'

export default {
  components: {
    Layout,
    ModelSidebar,
    ModelToolbar,
    ModelList,
    ModelModals
  },
  setup() {
    return useModelsView()
  }
}
</script>
