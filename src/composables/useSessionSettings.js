import { reactive, watch } from 'vue'
import { useChatStore } from '@/store/chat'
import { useSettingsStore } from '@/store/settings'

/**
 * 会话设置管理 Composable
 * 用于管理当前对话的参数设置
 */
export function useSessionSettings() {
    const chatStore = useChatStore()
    const settingsStore = useSettingsStore()

    // 默认设置
    const defaultSettings = {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        seed: -1,
        num_predict: 128,
        repeat_penalty: 1.1,
        num_ctx: 2048,
    }

    // 本地设置（响应式）
    const localSettings = reactive({
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        seed: -1,
        num_predict: 128,
        repeat_penalty: 1.1,
        num_ctx: 2048,
    })

    /**
     * 从当前会话加载设置
     */
    const loadSessionSettings = () => {
        if (!chatStore.currentSession) return

        const savedSettings = chatStore.currentSession.settings || {}
        localSettings.temperature = savedSettings.temperature ?? settingsStore.temperature
        localSettings.top_p = savedSettings.top_p ?? settingsStore.topP
        localSettings.top_k = savedSettings.top_k ?? settingsStore.topK
        localSettings.seed = savedSettings.seed ?? -1
        localSettings.num_predict = savedSettings.num_predict ?? 128
        localSettings.repeat_penalty = savedSettings.repeat_penalty ?? 1.1
        localSettings.num_ctx = savedSettings.num_ctx ?? 2048
    }

    /**
     * 保存设置到当前会话
     */
    const saveSessionSettings = () => {
        if (!chatStore.currentSession) return

        chatStore.updateSessionSettings(chatStore.currentSession.id, {
            temperature: localSettings.temperature,
            top_p: localSettings.top_p,
            top_k: localSettings.top_k,
            seed: localSettings.seed,
            num_predict: localSettings.num_predict,
            repeat_penalty: localSettings.repeat_penalty,
            num_ctx: localSettings.num_ctx,
        })
    }

    /**
     * 重置所有设置为默认值
     */
    const resetSessionSettings = () => {
        Object.assign(localSettings, defaultSettings)
        saveSessionSettings()
    }

    /**
     * 重置单个参数为默认值
     */
    const resetParam = (key) => {
        if (key in defaultSettings) {
            localSettings[key] = defaultSettings[key]
        }
    }

    /**
     * 监听会话切换，自动加载设置
     */
    const setupSessionWatcher = () => {
        watch(() => chatStore.currentSessionId, () => {
            loadSessionSettings()
        })
    }

    return {
        localSettings,
        defaultSettings,
        loadSessionSettings,
        saveSessionSettings,
        resetSessionSettings,
        resetParam,
        setupSessionWatcher,
    }
}
