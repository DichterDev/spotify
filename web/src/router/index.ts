import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '../views/HomeView.vue'
import AuthCallbackView from '@/views/AuthCallbackView.vue'

import editorRoutes from './editor'
import { useEditorStore } from '@/stores/editor'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/callback',
      name: 'auth',
      component: AuthCallbackView,
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

editorRoutes.map(r => router.addRoute(r))

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      await authStore.refresh()
      if (!authStore.isLoggedIn) {
        next({ name: 'login' })
      }
    }
  }

  if (to.name?.toString().includes('editor-')) {
    const editor = useEditorStore()
    if (!editor.target) next({ name: 'editor' })
  }

  // if(to.name === 'login' && authStore.isLoggedIn) next({ name: 'home'})
  next()
})

export default router
