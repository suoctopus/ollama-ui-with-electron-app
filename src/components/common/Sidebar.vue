<template>
  <div class="common-sidebar">
    <div class="sidebar-header">
      <slot name="header">
        <h3>{{ title }}</h3>
      </slot>
    </div>
    <div class="sidebar-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.common-sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  height: 56px; /* 统一标题行高度 */
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 左对齐 */
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px; /* 统一字体大小 */
  font-weight: 600;
  color: #333;
  text-align: left; /* 左对齐 */
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
</style>