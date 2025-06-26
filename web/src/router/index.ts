import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/EditorView.vue'),
      meta: { requiresAuth: true }
    },

  ],
})

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = useAuthStore().isLoggedIn
  if(to.meta.requiresAuth) {
    if(!isLoggedIn) {
      next({ name: 'login', query: { redirect: to.fullPath }})
    }
    if(await useAuthStore().refreshToken()) next()
  }

  if(to.name === 'login' && isLoggedIn) next({ name: 'home'})
  next()
})

export default router
