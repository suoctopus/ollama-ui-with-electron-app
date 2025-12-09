import { computed } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/chat',
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/components/chat/ChatView.vue'),
  },
  {
    path: '/models',
    name: 'models',
    component: () => import('@/components/models/ModelsView.vue'),
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/components/history/HistoryView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/components/settings/SettingsView.vue'),
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 导出路由 composable
export function useRouter() {
  const currentRoute = computed(() => router.currentRoute.value)
  
  const push = (to) => router.push(to)
  const replace = (to) => router.replace(to)
  const go = (delta) => router.go(delta)
  const back = () => router.back()
  const forward = () => router.forward()
  
  return {
    router,
    currentRoute,
    push,
    replace,
    go,
    back,
    forward
  }
}

// 导出路由实例供 main.js 使用
export { router }
