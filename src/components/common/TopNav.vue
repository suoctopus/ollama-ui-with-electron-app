<template>
  <nav class="top-nav">
    <div class="nav-brand">
      <slot name="brand" />
    </div>
    
    <div class="nav-links">
      <router-link to="/chat" class="nav-item">
        <MessageSquare :size="18" />
        <span>{{ t('nav.chat') }}</span>
      </router-link>
      
      <router-link to="/models" class="nav-item">
        <Box :size="18" />
        <span>{{ t('nav.models') }}</span>
      </router-link>
      
      <router-link to="/history" class="nav-item">
        <History :size="18" />
        <span>{{ t('nav.history') }}</span>
      </router-link>
      
      <router-link to="/settings" class="nav-item">
        <Settings :size="18" />
        <span>{{ t('nav.settings') }}</span>
      </router-link>
    </div>

    <!-- Global Search Box Teleport Target -->
    <div id="global-search"></div>
    
    <!-- Header Actions Teleport Target (not used anymore, kept for compatibility) -->
    <div id="header-actions"></div>
    
    <div class="nav-actions">
      <slot name="actions" />
    </div>
  </nav>
</template>

<script>
import { useTopNav } from '@/composables/common/useTopNav'
import { MessageSquare, Box, History, Settings } from 'lucide-vue-next'

export default {
  components: {
    MessageSquare,
    Box,
    History,
    Settings
  },
  setup() {
    return useTopNav()
  }
}
</script>