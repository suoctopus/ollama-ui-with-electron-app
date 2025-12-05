import { createRouter, createWebHashHistory } from 'vue-router'
import ChatView from '@/views/ChatView.vue'
import ModelsView from '@/views/ModelsView.vue'
import HistoryView from '@/views/HistoryView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes = [
    {
        path: '/',
        redirect: '/chat',
    },
    {
        path: '/chat',
        name: 'chat',
        component: ChatView,
    },
    {
        path: '/models',
        name: 'models',
        component: ModelsView,
    },
    {
        path: '/history',
        name: 'history',
        component: HistoryView,
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsView,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
