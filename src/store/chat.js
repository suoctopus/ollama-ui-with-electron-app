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
        // ... (existing actions) ...

        // ... (existing actions) ...

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

        // ... (existing actions) ...

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
