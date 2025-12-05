import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export const useChatStore = defineStore('chat', {
    state: () => ({
        sessions: [],
        categories: [], // List of category names
        currentSessionId: null,
        generating: false,
    }),

    getters: {
        currentSession: (state) => {
            return state.sessions.find(s => s.id === state.currentSessionId)
        },

        currentMessages: (state) => {
            const session = state.sessions.find(s => s.id === state.currentSessionId)
            return session ? session.messages : []
        },
    },

    actions: {
        // Add addMessage method here
        addMessage(message) {
            if (!this.currentSession) {
                this.createSession()
            }
            
            const newMessage = {
                id: nanoid(),
                role: message.role,
                content: message.content || '',
                thinking: message.thinking || '',
                images: message.images || [],
                createdAt: Date.now(), // 使用createdAt而不是timestamp以保持一致性
                hidden: false,
                ...message
            }
            
            this.currentSession.messages.push(newMessage)
            this.saveToStorage()
            return newMessage
        },

        updateMessage(id, updates) {
            const session = this.currentSession
            if (!session) return
            
            const message = session.messages.find(m => m.id === id)
            if (message) {
                Object.assign(message, updates)
                this.saveToStorage()
            }
        },

        deleteMessage(id) {
            const session = this.currentSession
            if (!session) return
            
            const index = session.messages.findIndex(m => m.id === id)
            if (index !== -1) {
                session.messages.splice(index, 1)
                this.saveToStorage()
            }
        },

        toggleMessageVisibility(id, hidden) {
            const session = this.currentSession
            if (!session) return
            
            const message = session.messages.find(m => m.id === id)
            if (message) {
                message.hidden = hidden
                this.saveToStorage()
            }
        },

        createSession(model = '') {
            const newSession = {
                id: nanoid(),
                title: 'New Chat',
                model: model,
                category: '',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                messages: [],
                settings: {}
            }
            
            this.sessions.unshift(newSession)
            this.currentSessionId = newSession.id
            this.saveToStorage()
            return newSession
        },

        deleteSession(id) {
            this.sessions = this.sessions.filter(s => s.id !== id)
            if (this.currentSessionId === id) {
                this.currentSessionId = this.sessions[0]?.id || null
            }
            this.saveToStorage()
        },

        updateSessionSettings(id, settings) {
            const session = this.sessions.find(s => s.id === id)
            if (session) {
                session.settings = { ...session.settings, ...settings }
                this.saveToStorage()
            }
        },

        setCurrentSession(id) {
            this.currentSessionId = id
            this.saveToStorage()
        },

        addCategory(name) {
            if (!this.categories.includes(name)) {
                this.categories.push(name)
                this.saveToStorage()
            }
        },

        renameSession(id, newTitle) {
            const session = this.sessions.find(s => s.id === id)
            if (session) {
                session.title = newTitle
                this.saveToStorage()
            }
        },

        setSessionCategory(id, category) {
            const session = this.sessions.find(s => s.id === id)
            if (session) {
                session.category = category
                this.saveToStorage()
            }
        },

        deleteCategory(name) {
            this.categories = this.categories.filter(c => c !== name)
            // Optional: Clear category from sessions? Or keep them as "orphaned" text?
            // User requirement: "All chat records default to Uncategorized".
            // If we delete a category, sessions in it should probably become uncategorized.
            this.sessions.forEach(s => {
                if (s.category === name) {
                    s.category = ''
                }
            })
            this.saveToStorage()
        },

        saveToStorage() {
            localStorage.setItem('chat-sessions', JSON.stringify({
                sessions: this.sessions,
                categories: this.categories,
                currentSessionId: this.currentSessionId,
            }))
        },

        loadFromStorage() {
            const saved = localStorage.getItem('chat-sessions')
            if (saved) {
                const data = JSON.parse(saved)
                this.sessions = data.sessions || []
                this.categories = data.categories || []
                this.currentSessionId = data.currentSessionId
            }

            // Create default session if none exists
            if (this.sessions.length === 0) {
                this.createSession()
            }
        },
    },
})