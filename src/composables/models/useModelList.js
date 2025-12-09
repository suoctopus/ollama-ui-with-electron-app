import { Box } from 'lucide-vue-next'

export function useModelList(props, emit) {
  // Event handlers
  const handleLoad = (model) => {
    emit('load', model)
  }

  const handleUnload = (model) => {
    emit('unload', model)
  }

  const handleDelete = (model) => {
    emit('delete', model)
  }

  const handleShowDetails = (model) => {
    emit('show-details', model)
  }

  return {
    // Methods
    handleLoad,
    handleUnload,
    handleDelete,
    handleShowDetails,
    
    // Icons
    Box
  }
}
