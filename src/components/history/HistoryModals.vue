<template>
  <div>
    <!-- Rename Dialog -->
    <el-dialog
      :model-value="renameDialogVisible"
      @update:model-value="handleUpdateRenameDialogVisible"
      :title="$t('history.editTitle')"
      width="400px"
    >
      <el-input 
        :model-value="newTitle"
        @update:model-value="handleUpdateNewTitle"
        :placeholder="$t('history.rename')" 
        @keyup.enter="handleConfirmRename" 
      />
      <template #footer>
        <el-button @click="handleUpdateRenameDialogVisible(false)">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirmRename">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- Category Dialog (Move Session) -->
    <el-dialog
      :model-value="categoryDialogVisible"
      @update:model-value="handleUpdateCategoryDialogVisible"
      :title="$t('history.setCategory')"
      width="400px"
    >
      <el-select
        :model-value="newCategory"
        @update:model-value="handleUpdateNewCategory"
        filterable
        allow-create
        default-first-option
        :placeholder="$t('history.enterCategory')"
        style="width: 100%"
      >
        <el-option
          v-for="item in categories"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <template #footer>
        <el-button @click="handleUpdateCategoryDialogVisible(false)">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirmCategory">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- Add Category Dialog -->
    <el-dialog
      :model-value="addCategoryDialogVisible"
      @update:model-value="handleUpdateAddCategoryDialogVisible"
      :title="$t('history.addCategory')"
      width="400px"
    >
      <el-input 
        :model-value="newCategoryName"
        @update:model-value="handleUpdateNewCategoryName"
        :placeholder="$t('history.categoryName')" 
        @keyup.enter="handleConfirmAddCategory" 
      />
      <template #footer>
        <el-button @click="handleUpdateAddCategoryDialogVisible(false)">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirmAddCategory">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useHistoryModals } from '@/composables/history/useHistoryModals'

export default {
  props: {
    renameDialogVisible: Boolean,
    categoryDialogVisible: Boolean,
    addCategoryDialogVisible: Boolean,
    newTitle: String,
    newCategory: String,
    newCategoryName: String,
    categories: Array
  },
  emits: [
    'update:renameDialogVisible',
    'update:categoryDialogVisible',
    'update:addCategoryDialogVisible',
    'update:newTitle',
    'update:newCategory',
    'update:newCategoryName',
    'confirm-rename',
    'confirm-category',
    'confirm-add-category'
  ],
  setup(props, { emit }) {
    return useHistoryModals(props, emit)
  }
}
</script>
