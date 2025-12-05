import { defineStore } from 'pinia'

export const useModelStore = defineStore('models', {
    state: () => ({
        models: [],
        runningModels: [], // 运行中的模型列表
        modelKeepAliveSettings: {}, // 每个模型的 keep_alive 设置 { modelName: keepAlive }
        loadingModels: [], // 正在加载/卸载的模型列表
        loading: false,
        pulling: false,
        pullProgress: null,
    }),

    getters: {
        modelNames: (state) => state.models.map(m => m.name),

        // 检查模型是否正在运行
        isModelRunning: (state) => (modelName) => {
            return state.runningModels.some(m => m.name === modelName)
        },

        // 获取模型的 keep_alive 设置
        getModelKeepAlive: (state) => (modelName) => {
            return state.modelKeepAliveSettings[modelName] || '5m'
        },

        // 检查模型是否正在加载/卸载
        isModelLoading: (state) => (modelName) => {
            return state.loadingModels.includes(modelName)
        },
    },

    actions: {
        setModels(models) {
            this.models = models
        },

        addModel(model) {
            const index = this.models.findIndex(m => m.name === model.name)
            if (index >= 0) {
                this.models[index] = model
            } else {
                this.models.push(model)
            }
        },

        removeModel(name) {
            this.models = this.models.filter(m => m.name !== name)
        },

        setLoading(loading) {
            this.loading = loading
        },

        setPulling(pulling) {
            this.pulling = pulling
        },

        setPullProgress(progress) {
            this.pullProgress = progress
        },

        // 设置运行中的模型列表
        setRunningModels(models) {
            this.runningModels = models || []
        },

        // 更新单个模型的运行状态
        updateModelRunningStatus(modelName, isRunning) {
            if (isRunning) {
                // 添加到运行列表（如果不存在）
                if (!this.runningModels.some(m => m.name === modelName)) {
                    this.runningModels.push({ name: modelName })
                }
            } else {
                // 从运行列表中移除
                this.runningModels = this.runningModels.filter(m => m.name !== modelName)
            }
        },

        // 设置模型的 keep_alive 配置
        setModelKeepAlive(modelName, keepAlive) {
            this.modelKeepAliveSettings[modelName] = keepAlive
        },

        // 设置模型加载状态
        setModelLoading(modelName, isLoading) {
            if (isLoading) {
                if (!this.loadingModels.includes(modelName)) {
                    this.loadingModels.push(modelName)
                }
            } else {
                this.loadingModels = this.loadingModels.filter(name => name !== modelName)
            }
        },
    },
})

