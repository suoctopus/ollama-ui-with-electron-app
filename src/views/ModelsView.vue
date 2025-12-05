<template>
  <Layout>
    <div class="models-view">
      <!-- Global Search Teleport -->
      <Teleport to="#global-search" v-if="mounted">
        <el-input
          v-model="searchQuery"
          :placeholder="$t('models.search')"
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
          v-model:currentFamily="currentFamily"
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

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useModelStore } from '@/store/models'
import { listModels, deleteModel, loadModel, unloadModel, listRunningModels } from '@/api/ollama'
import Layout from '@/components/Layout.vue'
import ModelSidebar from '@/components/models/ModelSidebar.vue'
import ModelToolbar from '@/components/models/ModelToolbar.vue'
import ModelList from '@/components/models/ModelList.vue'
import ModelModals from '@/components/models/ModelModals.vue'
import { Search } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const modelStore = useModelStore()

const loading = ref(false)
const searchQuery = ref('')
const pullDialogVisible = ref(false)
const detailsDrawerVisible = ref(false)
const selectedModel = ref(null)
const mounted = ref(false)
const currentFamily = ref('all')
let intervalId = null

const models = computed(() => modelStore.models || [])

const filteredModels = computed(() => {
  let result = models.value
  
  // Filter by family
  if (currentFamily.value !== 'all') {
    result = result.filter(m => m.details?.family === currentFamily.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => 
      m.name.toLowerCase().includes(query) ||
      (m.details?.family || '').toLowerCase().includes(query)
    )
  }
  
  return result
})

const isModelLoading = (modelName) => {
  return modelStore.isModelLoading(modelName)
}

const loadLocalModels = async () => {
  loading.value = true
  try {
    const data = await listModels()
    modelStore.setModels(data.models || [])
  } catch (error) {
    console.error('Failed to load models:', error)
    ElMessage.error(t('models.loadFailed'))
  } finally {
    loading.value = false
  }
}

const loadRunningModels = async () => {
  try {
    const data = await listRunningModels()
    modelStore.setRunningModels(data.models || [])
  } catch (error) {
    console.error('Failed to load running models:', error)
  }
}

const handleLoadModel = async (model) => {
  if (isModelLoading(model.name)) return

  modelStore.setModelLoading(model.name, true)
  try {
    const keepAlive = modelStore.getModelKeepAlive(model.name)
    const success = await loadModel(model.name, keepAlive)
    if (success) {
      ElMessage.success(t('models.loadSuccess'))
      modelStore.updateModelRunningStatus(model.name, true)
      await loadRunningModels()
    } else {
      ElMessage.error(t('models.loadFailed'))
    }
  } catch (error) {
    console.error('Load model error:', error)
    ElMessage.error(t('models.loadFailed'))
  } finally {
    modelStore.setModelLoading(model.name, false)
  }
}

const handleUnloadModel = async (model) => {
  if (isModelLoading(model.name)) return

  modelStore.setModelLoading(model.name, true)
  try {
    const success = await unloadModel(model.name)
    if (success) {
      ElMessage.success(t('models.unloadSuccess'))
      modelStore.updateModelRunningStatus(model.name, false)
      await loadRunningModels()
    } else {
      ElMessage.error(t('models.unloadFailed'))
    }
  } catch (error) {
    console.error('Unload model error:', error)
    ElMessage.error(t('models.unloadFailed'))
  } finally {
    modelStore.setModelLoading(model.name, false)
  }
}

const handleDeleteModel = async (model) => {
  try {
    await ElMessageBox.confirm(
      t('models.deleteConfirm', { name: model.name }),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
    
    const success = await deleteModel(model.name)
    if (success) {
      ElMessage.success(t('models.deleteSuccess'))
      loadLocalModels()
    } else {
      ElMessage.error(t('models.deleteFailed'))
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete model error:', error)
      ElMessage.error(t('models.deleteFailed'))
    }
  }
}

const handleShowDetails = (model) => {
  selectedModel.value = model
  detailsDrawerVisible.value = true
}

onMounted(() => {
  mounted.value = true // Set mounted true
  loadLocalModels()
  loadRunningModels()
  intervalId = setInterval(loadRunningModels, 10000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
})
</script>

<style scoped>
.models-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.models-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.models-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
