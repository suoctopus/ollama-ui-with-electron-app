<template>
  <GenericToolbar
    :left-text="filteredModels.length > 0 ? $t('models.modelCount', { count: filteredModels.length }) : ''"
    :right-buttons="rightButtons"
  />
</template>

<script setup>
import { RefreshCw, Download } from 'lucide-vue-next'
import GenericToolbar from '@/components/common/GenericToolbar.vue'

const props = defineProps({
  filteredModels: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh', 'open-pull-dialog'])

const rightButtons = [
  {
    props: {
      icon: RefreshCw,
      loading: props.loading,
      size: 'small'
    },
    text: $t('models.refresh'),
    handler: () => emit('refresh')
  },
  {
    props: {
      type: 'primary',
      icon: Download,
      size: 'small'
    },
    text: $t('models.pull'),
    handler: () => emit('open-pull-dialog')
  }
]
</script>