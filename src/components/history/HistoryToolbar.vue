<template>
  <GenericToolbar
    :left-text="leftText"
    :right-buttons="rightButtons"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

const emit = defineEmits(['delete-selected'])

const leftText = computed(() => {
  return props.filteredSessionsCount > 0 ? t('history.sessionCount', { count: props.filteredSessionsCount }) : ''
})

const rightButtons = computed(() => [
  {
    props: {
      type: 'danger',
      disabled: props.selectedSessionsCount === 0,
      icon: Trash2,
      size: 'small',
      plain: true
    },
    text: t('history.deleteSelected'),
    handler: () => emit('delete-selected')
  }
])
</script>