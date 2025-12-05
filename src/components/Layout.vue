<template>
  <div class="layout">
    <!-- Top Navigation Bar -->
    <TopNav>
    </TopNav>
    
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import TopNav from '@/components/common/TopNav.vue'
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: hidden;
  background: #f5f5f5;
}
</style>
