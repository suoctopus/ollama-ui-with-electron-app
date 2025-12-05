<template>
  <nav class="top-nav">
    <div class="nav-brand">
      <slot name="brand" />
    </div>
    
    <div class="nav-links">
      <router-link to="/chat" class="nav-item">
        <MessageSquare :size="18" />
        <span>{{ $t('nav.chat') }}</span>
      </router-link>
      
      <router-link to="/models" class="nav-item">
        <Box :size="18" />
        <span>{{ $t('nav.models') }}</span>
      </router-link>
      
      <router-link to="/history" class="nav-item">
        <History :size="18" />
        <span>{{ $t('nav.history') }}</span>
      </router-link>
      
      <router-link to="/settings" class="nav-item">
        <Settings :size="18" />
        <span>{{ $t('nav.settings') }}</span>
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

<script setup>
import { MessageSquare, Box, History, Settings } from 'lucide-vue-next'
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: center;
  padding: 0 4px;
  height: 56px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  gap: 4px;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.nav-brand:empty {
  display: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 6px;
  text-decoration: none;
  color: #666;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-item:hover {
  background: #f5f7fa;
  color: #333;
}

.nav-item.router-link-exact-active {
  background: #e6f7ff;
  color: #409eff;
  font-weight: 500;
}

#global-search {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>