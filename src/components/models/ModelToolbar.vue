<template>
  <GenericToolbar
    :left-text="leftText"
    :right-buttons="rightButtons"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

const emit = defineEmits(['refresh', 'open-pull-dialog'])

const leftText = computed(() => {
  return props.filteredModels.length > 0 ? t('models.modelCount', { count: props.filteredModels.length }) : ''
})

const rightButtons = [
  {
    props: {
      icon: RefreshCw,
      loading: props.loading,
      size: 'small'
    },
    text: t('models.refresh'),
    handler: () => emit('refresh')
  },
  {
    props: {
      type: 'primary',
      icon: Download,
      size: 'small'
    },
    text: t('models.pull'),
    handler: () => emit('open-pull-dialog')
  }
]
</script>