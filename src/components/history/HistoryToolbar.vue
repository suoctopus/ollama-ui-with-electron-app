<template>
  <GenericToolbar
    :left-text="leftText"
    :right-buttons="rightButtons"
  />
</template>

<script>
import { useHistoryToolbar } from '@/composables/history/useHistoryToolbar'
import GenericToolbar from '@/components/common/GenericToolbar.vue'

export default {
  components: {
    GenericToolbar
  },
  props: {
    filteredSessionsCount: {
      type: Number,
      default: 0
    },
    selectedSessionsCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['delete-selected'],
  setup(props, { emit }) {
    return useHistoryToolbar(props, emit)
  }
}
</script>