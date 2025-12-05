<template>
  <GenericToolbar
    :left-text="filteredSessionsCount > 0 ? $t('history.sessionCount', { count: filteredSessionsCount }) : ''"
    :right-buttons="rightButtons"
  />
</template>

<script setup>
import { Trash2 } from 'lucide-vue-next'
import GenericToolbar from '@/components/common/GenericToolbar.vue'

const props = defineProps({
  filteredSessionsCount: {
    type: Number,
    default: 0
  },
  selectedSessionsCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['delete-selected'])

const rightButtons = [
  {
    props: {
      type: 'danger',
      disabled: props.selectedSessionsCount === 0,
      icon: Trash2,
      size: 'small',
      plain: true
    },
    text: $t('history.deleteSelected'),
    handler: () => emit('delete-selected')
  }
]
</script>

<style scoped>
.sessions-count {
  font-size: 13px;
  color: #666;
}
</style>
