import api from '@/api/api'

export default {
    // GET /users
    allUsers() {
        return api().get("users");
    },

    getUserProfile(user_id) {
        return api().get(`users/${user_id}`);
    },

    login(userInfo) {
        return api().post("users/login", userInfo)
    },

    register(userInfo) {
        return api().post("users", userInfo);
    },

    editProfile(userInfo) {
        return api().put(`users/${userInfo.id}`, userInfo)
    }
}