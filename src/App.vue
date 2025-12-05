<template>
  <div id="app" :style="{ fontSize: settings.fontSize + 'px' }">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from './store/settings'
import { useChatStore } from './store/chat'

const settings = useSettingsStore()
const chat = useChatStore()

onMounted(() => {
  // 从 localStorage 加载设置
  settings.loadFromStorage()
  chat.loadFromStorage()
})
</script>

<style>
/* Global styles are in src/styles/main.css */
</style>
