import { computed } from 'vue'
import { createI18n as createVueI18n } from 'vue-i18n'
import zhCN from '@/i18n/locales/zh-CN.json'
import enUS from '@/i18n/locales/en-US.json'

// 创建 i18n 实例
const i18n = createVueI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': {
      ...zhCN
    },
    'en-US': {
      ...enUS
    },
  },
})

// 导出 i18n composable
export function useI18n() {
  const { t, locale, availableLocales } = i18n.global
  
  const currentLocale = computed({
    get: () => locale.value,
    set: (val) => {
      locale.value = val
    }
  })
  
  const setLocale = (newLocale) => {
    if (availableLocales.includes(newLocale)) {
      locale.value = newLocale
    }
  }
  
  const getLocale = () => locale.value
  
  return {
    t,
    locale: currentLocale,
    availableLocales,
    setLocale,
    getLocale
  }
}

// 导出 i18n 实例供 main.js 使用
export { i18n }
