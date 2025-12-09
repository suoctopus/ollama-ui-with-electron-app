// src/composables/common/useTopNav.js
import { MessageSquare, Box, History, Settings } from 'lucide-vue-next'
import { useI18n } from '@/composables/core/useI18n'

export function useTopNav() {
  const { t } = useI18n()
  
  return {
    // Icons
    MessageSquare,
    Box,
    History,
    Settings,
    
    // i18n
    t
  }
}
