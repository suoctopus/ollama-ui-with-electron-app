<template>
  <div class="common-toolbar">
    <div class="toolbar-left">
      <slot name="left" />
    </div>
    <div class="toolbar-right">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import { useToolbar } from '@/composables/common/useToolbar'

export default {
  setup() {
    return useToolbar()
  }
}
</script>