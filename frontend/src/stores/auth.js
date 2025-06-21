import { defineStore } from 'pinia'

export const useAuthStore = defineStore("user", {
    state: () => ({
        token: localStorage.getItem('token') || null,
        userId: parseInt(localStorage.getItem('userId')) || null,
        userRole: localStorage.getItem('userRole') || null
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

        setUserRole(userRole) {
            this.userRole = userRole;
            localStorage.setItem("userRole", userRole);
        },
        
        logout() {
            this.token = null;
            this.userId = null;
            this.userRole = null;

            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('userRole')
        }
    }
})