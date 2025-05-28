import { defineStore } from 'pinia'

export const useAuthStore = defineStore("user", {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem("user")) || null
    }),

    actions: {
        setToken(token) {
            this.token = token
            localStorage.setItem("token", token)
        },

        setUser(user) {
            this.user = user;
        },
        
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    }
})