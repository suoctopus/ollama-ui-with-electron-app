<template>
  <div>
    <!-- Rename Dialog -->
    <el-dialog
      :model-value="renameDialogVisible"
      @update:model-value="$emit('update:renameDialogVisible', $event)"
      :title="$t('history.editTitle')"
      width="400px"
    >
      <el-input 
        :model-value="newTitle"
        @update:model-value="$emit('update:newTitle', $event)"
        :placeholder="$t('history.rename')" 
        @keyup.enter="$emit('confirm-rename')" 
      />
      <template #footer>
        <el-button @click="$emit('update:renameDialogVisible', false)">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="$emit('confirm-rename')">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- Category Dialog (Move Session) -->
    <el-dialog
      :model-value="categoryDialogVisible"
      @update:model-value="$emit('update:categoryDialogVisible', $event)"
      :title="$t('history.setCategory')"
      width="400px"
    >
      <el-select
        :model-value="newCategory"
        @update:model-value="$emit('update:newCategory', $event)"
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
        <el-button @click="$emit('update:categoryDialogVisible', false)">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="$emit('confirm-category')">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- Add Category Dialog -->
    <el-dialog
      :model-value="addCategoryDialogVisible"
      @update:model-value="$emit('update:addCategoryDialogVisible', $event)"
      :title="$t('history.addCategory')"
      width="400px"
    >
      <el-input 
        :model-value="newCategoryName"
        @update:model-value="$emit('update:newCategoryName', $event)"
        :placeholder="$t('history.categoryName')" 
        @keyup.enter="$emit('confirm-add-category')" 
      />
      <template #footer>
        <el-button @click="$emit('update:addCategoryDialogVisible', false)">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="$emit('confirm-add-category')">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
defineProps({
  renameDialogVisible: Boolean,
  categoryDialogVisible: Boolean,
  addCategoryDialogVisible: Boolean,
  newTitle: String,
  newCategory: String,
  newCategoryName: String,
  categories: Array
})

defineEmits([
  'update:renameDialogVisible',
  'update:categoryDialogVisible',
  'update:addCategoryDialogVisible',
  'update:newTitle',
  'update:newCategory',
  'update:newCategoryName',
  'confirm-rename',
  'confirm-category',
  'confirm-add-category'
])
</script>
