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

<script>
import { useLayout } from '@/composables/common/useLayout'
import TopNav from '@/components/common/TopNav.vue'

export default {
  components: {
    TopNav
  },
  setup() {
    return useLayout()
  }
}
</script>
