import { createApp } from 'vue'
import { router } from '@/composables/core/useRouter'
import i18n from './i18n'
import App from './App.vue'

// Initialize state management
import { useChatState, useSettings, useModels } from '@/composables/core/useState'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// Highlight.js for code highlighting in markdown
import 'highlight.js/styles/github-dark.css'

// Custom styles
import './styles/main.scss'

const app = createApp(App)

// Initialize state from localStorage
const chatState = useChatState()
const settings = useSettings()

chatState.loadFromStorage()
settings.loadFromStorage()

app.use(router)
app.use(i18n)
app.use(ElementPlus, {
    locale: zhCn,
})

app.mount('#app')
