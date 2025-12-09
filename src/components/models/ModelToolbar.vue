<template>
  <GenericToolbar
    :left-text="leftText"
    :right-buttons="rightButtons"
  />
</template>

<script>
import { useModelToolbar } from '@/composables/models/useModelToolbar'
import GenericToolbar from '@/components/common/GenericToolbar.vue'

export default {
  components: {
    GenericToolbar
  },
  props: {
    filteredModels: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['refresh', 'open-pull-dialog'],
  setup(props, { emit }) {
    return useModelToolbar(props, emit)
  }
}
</script>