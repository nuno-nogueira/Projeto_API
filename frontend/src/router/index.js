import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import MapsView from '@/views/MapsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
     {
      path: '/maps',
      name: 'maps',
      component: MapsView,
    },
    {
      path: '/profile/:userId',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      props: true
    },
  ],
})
export default router