import api from '@/api/api'

export default {
    // GET /users
    allUsers() {
        return api().get("users");
    },

    getUserProfile(user_id) {
        return api().get(`users/${user_id}`);
    },

    login() {
    //POST /users/login
        return api().post("users/login")
    },

    register(userInfo) {
        return api().post("users", userInfo);
    }
}