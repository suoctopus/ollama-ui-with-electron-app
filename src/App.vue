<template>
  <div id="app" :style="appStyle">
    <router-view />
  </div>
</template>

<script>
import { useApp } from '@/composables/useApp'

export default {
  setup() {
    return useApp()
  }
}
</script>
