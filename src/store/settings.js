import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        ollamaUrl: 'http://localhost:11434',
        language: 'zh-CN',
        theme: 'auto',
        fontSize: 14,

        // Basic generation settings
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxTokens: 2048,

        // Sampling parameters
        seed: -1,                // Random seed (-1 for random)
        numPredict: 128,         // Max tokens to generate
        minP: 0.0,               // Minimum probability threshold
        typicalP: 1.0,           // Typical sampling parameter

        // Repetition penalty parameters
        repeatLastN: 64,         // Context length for repetition detection
        repeatPenalty: 1.1,      // Repetition penalty coefficient
        presencePenalty: 0.0,    // Presence penalty
        frequencyPenalty: 0.0,   // Frequency penalty

        // Context parameters
        numCtx: 2048,            // Context window size
        numKeep: 5,              // Number of tokens to keep

        // Hardware parameters
        numGpu: -1,              // GPU layers (-1 for all)
        numThread: 0,            // CPU threads (0 for auto)

        // Other parameters
        keepAlive: '5m',         // Model keep alive duration
        systemPrompt: '',        // System prompt
        stopSequences: [],       // Stop sequences
    }),

    actions: {
        setOllamaUrl(url) {
            this.ollamaUrl = url
            this.saveToStorage()
        },

        setLanguage(lang) {
            this.language = lang
            this.saveToStorage()
        },

        setTheme(theme) {
            this.theme = theme
            this.saveToStorage()
        },

        setFontSize(size) {
            this.fontSize = size
            this.saveToStorage()
        },

        updateAdvancedSettings(settings) {
            Object.assign(this, settings)
            this.saveToStorage()
        },

        saveToStorage() {
            localStorage.setItem('settings', JSON.stringify(this.$state))
        },

        loadFromStorage() {
            const saved = localStorage.getItem('settings')
            if (saved) {
                const parsed = JSON.parse(saved)
                // Merge with defaults to handle new fields
                Object.keys(this.$state).forEach(key => {
                    if (parsed[key] !== undefined) {
                        this.$state[key] = parsed[key]
                    }
                })
            }
        },

        reset() {
            this.$reset()
            this.saveToStorage()
        },

        resetKey(key) {
            const defaults = {
                ollamaUrl: 'http://localhost:11434',
                language: 'zh-CN',
                theme: 'auto',
                fontSize: 14,
                temperature: 0.7,
                topP: 0.9,
                topK: 40,
                maxTokens: 2048,
                seed: -1,
                numPredict: 128,
                minP: 0.0,
                typicalP: 1.0,
                repeatLastN: 64,
                repeatPenalty: 1.1,
                presencePenalty: 0.0,
                frequencyPenalty: 0.0,
                numCtx: 2048,
                numKeep: 5,
                numGpu: -1,
                numThread: 0,
                keepAlive: '5m',
                systemPrompt: '',
                stopSequences: [],
            }
            if (key in defaults) {
                this[key] = defaults[key]
                this.saveToStorage()
            }
        },
    },
})
