export function useHistoryModals(props, emit) {
  const handleUpdateRenameDialogVisible = (value) => {
    emit('update:renameDialogVisible', value)
  }

  const handleUpdateCategoryDialogVisible = (value) => {
    emit('update:categoryDialogVisible', value)
  }

  const handleUpdateAddCategoryDialogVisible = (value) => {
    emit('update:addCategoryDialogVisible', value)
  }

  const handleUpdateNewTitle = (value) => {
    emit('update:newTitle', value)
  }

  const handleUpdateNewCategory = (value) => {
    emit('update:newCategory', value)
  }

  const handleUpdateNewCategoryName = (value) => {
    emit('update:newCategoryName', value)
  }

  const handleConfirmRename = () => {
    emit('confirm-rename')
  }

  const handleConfirmCategory = () => {
    emit('confirm-category')
  }

  const handleConfirmAddCategory = () => {
    emit('confirm-add-category')
  }

  return {
    handleUpdateRenameDialogVisible,
    handleUpdateCategoryDialogVisible,
    handleUpdateAddCategoryDialogVisible,
    handleUpdateNewTitle,
    handleUpdateNewCategory,
    handleUpdateNewCategoryName,
    handleConfirmRename,
    handleConfirmCategory,
    handleConfirmAddCategory
  }
}
