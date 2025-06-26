import ky from "ky";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const isLoggedIn = ref(false)

  function setToken(t: string) {
    token.value = t
    isLoggedIn.value = true
  }

  function getToken() {
    return token.value
  }

  async function login() {
    const url = import.meta.env.VITE_APP_BACKEND_URL
    window.location.href = `${url}/login`
  }

  function logout() {
    token.value = ''
    isLoggedIn.value = false
  }

  async function refresh() {
    const url = import.meta.env.VITE_APP_BACKEND_URL
    const res = await ky.post(`${url}/refresh`, { credentials: 'include' }).json<{ access_token: string, expires_in: number }>()
    setToken(res.access_token)
  }

  async function getAccessToken(state: string) {
    const url = import.meta.env.VITE_APP_BACKEND_URL
    const res = await ky.post(`${url}/token?state=${state}`).json<{ access_token: string }>()
    setToken(res.access_token)
  }

  return {
    isLoggedIn,
    getToken,
    login,
    logout,
    refresh,
    getAccessToken
  }
})