import { defineStore } from 'pinia'

export const useAuthStore = defineStore("user", {
    state: () => ({
        token: localStorage.getItem('token') || null,
        userId: parseInt(localStorage.getItem('userId')) || null
    }),

    actions: {
        setToken(token) {
            this.token = token
            localStorage.setItem("token", token)
        },

        setUserId(userId) {
            this.userId = userId;
            localStorage.setItem("userId", userId.toString());
        },
        
        logout() {
            this.token = null;
            this.userId = null;
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
        }
    }
})