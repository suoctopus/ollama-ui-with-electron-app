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

<script>
import { useGenericToolbar } from '@/composables/common/useGenericToolbar'
import Toolbar from '@/components/common/Toolbar.vue'

export default {
  components: {
    Toolbar
  },
  props: {
    leftText: {
      type: String,
      default: ''
    },
    rightButtons: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    return useGenericToolbar()
  }
}
</script>