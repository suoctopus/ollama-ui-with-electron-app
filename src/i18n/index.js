import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

const i18n = createI18n({
    legacy: false,
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
        'zh-CN': {
            ...zhCN,
            settings: {
                ...zhCN.settings,
                search: '搜索设置...'
            }
        },
        'en-US': {
            ...enUS,
            settings: {
                ...enUS.settings,
                search: 'Search settings...'
            }
        },
    },
})

export default i18n
