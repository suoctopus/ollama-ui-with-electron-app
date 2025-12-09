import { History, Edit, FolderInput, Trash2, Box } from 'lucide-vue-next'

export function useSessionList(props, emit) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
    if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
    
    return date.toLocaleDateString('zh-CN')
  }

  const handleSelectSession = (session) => {
    emit('select-session', session)
  }

  const handleRenameSession = (session) => {
    emit('rename-session', session)
  }

  const handleCategorySession = (session) => {
    emit('category-session', session)
  }

  const handleDeleteSession = (session) => {
    emit('delete-session', session)
  }

  const handleUpdateSelectedSessions = (value) => {
    emit('update:selectedSessions', value)
  }

  return {
    // Icons
    History,
    Edit,
    FolderInput,
    Trash2,
    Box,
    
    // Methods
    formatTime,
    handleSelectSession,
    handleRenameSession,
    handleCategorySession,
    handleDeleteSession,
    handleUpdateSelectedSessions
  }
}
