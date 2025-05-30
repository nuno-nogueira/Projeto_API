<template>
        <!-- not logged -->
        <div class="navbar">
            <div class="navbar-left">
                <RouterLink :to="{name: 'home'}"><img src="@/assets/icons/logo.svg" alt=""></RouterLink>
                <a href="">Serviços</a>
                <a href="">Mapa</a>
                <a href="">Contactos</a>
            </div>
            <div class="navbar-right">
                <template v-if="!isAuthenticated">
                    <RouterLink :to="{name: 'signup'}">Criar conta</RouterLink>
                    <v-btn color="#09A129">
                        <RouterLink :to="{name: 'login'}" class="link-white">Entrar</RouterLink>
                    </v-btn>
                </template>

                <template v-else>
                    <v-btn icon color="#fff">
                        <RouterLink :to="{name: 'profile', params: {userId: authStore.user.user_id}}">
                            <v-icon color="#043601">mdi-account</v-icon>
                        </RouterLink>
                    </v-btn>
                    <v-btn @click="logout" color="#09A129">Sair</v-btn>
                </template>
            </div>
        </div>
        <!-- logged -->
        <!-- <div class="navbar">
            <div class="navbar-left">
                <a href=""><img src="@/assets/icons/logo.svg" alt=""></a>
                <a href="">Serviços</a>
                <a href="">Mapa</a>
                <a href="">Contactos</a>
            </div>
            <div class="navbar-right">
                <v-btn icon color="#fff">
                    <v-icon color="#043601">mdi-account</v-icon>
                </v-btn>
                <v-btn color="#09A129">Sair</v-btn>
            </div>
        </div> -->
</template>
<script>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

export default {
    name: 'Navbar',

    components: {
        RouterLink,
    },

    data() {
        return {
            authStore: useAuthStore(),
        }
    },

    setup() {
        const auth = useAuthStore()
        return auth;
    },

    methods: {
        logout() {
            this.authStore.logout();
            this.$router.push({ name: 'home'})
        }
    },

    computed: {
        isAuthenticated() {
            console.log(this.authStore);
            
            return !!this.authStore.token
        }
    },
};


</script>
<style scoped>
    .navbar {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 85vw;
        height: 60px;
        background-color: white;
        color: #043601;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 8px;
        z-index: 100;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    .navbar-left, .navbar-right {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 10px 20px 5px 20px;
    }
    a {
        text-decoration: none;
        color: #043601;  
    }
    .link-white {
        color: white;
    }
</style>