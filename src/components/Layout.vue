<template>
  <div class="layout">
    <!-- Top Navigation Bar -->
    <header class="top-nav">
      <nav class="nav-links">
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
      </nav>

      <!-- Global Search Box Teleport Target -->
      <div id="global-search"></div>
      
      <!-- Header Actions Teleport Target (not used anymore, kept for compatibility) -->
      <div id="header-actions"></div>
    </header>
    
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { MessageSquare, Box, History, Settings } from 'lucide-vue-next'
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.top-nav {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.nav-brand h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
  margin-right: 40px;
}

.nav-links {
  display: flex;
  gap: 8px;
}

#global-search {
  margin-left: auto;
  display: flex;
  align-items: center;
}

#header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  gap: 8px;
  border-radius: 8px;
  font-size: 14px;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #333;
}

.nav-item.router-link-active {
  background: #e6f0ff;
  color: #409eff;
  font-weight: 500;
}

.main-content {
  flex: 1;
  overflow: hidden;
  background: #f5f5f5;
}
</style>
