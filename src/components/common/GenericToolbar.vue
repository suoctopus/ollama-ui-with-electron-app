<template>
  <Toolbar>
    <template #left>
      <slot name="left">
        <span v-if="leftText" class="toolbar-text">{{ leftText }}</span>
      </slot>
    </template>
    
    <template #right>
      <slot name="right">
        <el-button
          v-for="(button, index) in rightButtons"
          :key="index"
          v-bind="button.props"
          @click="button.handler"
        >
          {{ button.text }}
        </el-button>
      </slot>
    </template>
  </Toolbar>
</template>

<script setup>
import Toolbar from '@/components/common/Toolbar.vue'

defineProps({
  leftText: {
    type: String,
    default: ''
  },
  rightButtons: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.toolbar-text {
  font-size: 13px;
  color: #666;
}
</style>