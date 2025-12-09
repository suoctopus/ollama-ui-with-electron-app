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

<script>
import { useSidebar } from '@/composables/common/useSidebar'

export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return useSidebar(props)
  }
}
</script>