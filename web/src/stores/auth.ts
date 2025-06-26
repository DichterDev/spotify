import { generateCodeChallenge, generateRandomString } from "@/scripts/pkce";
import ky, { HTTPError } from "ky";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const isLoggedIn = ref(false)
  const scopes = ref<string[]>([
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
  ])

  function setToken(t: string) {
    token.value = t
    isLoggedIn.value = true
  }

  function getToken(): Ref<string | undefined> {
    return token
  }

  async function login() {
    if(isLoggedIn.value) return
    if(await refreshToken()) return

    const verifier = generateRandomString(128)
    const challenge = await generateCodeChallenge(verifier)
    const state = generateRandomString(16)

    const client = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL
    const redirectUrl = import.meta.env.VITE_APP_SPOTIFY_REDIRECT_URL

    const res = await ky.post(`${backendUrl}/session`, { json: {
      code_verifier: verifier,
      state: state,
    }})

    const params = new URLSearchParams()
    params.append('client_id', client)
    params.append('response_type', 'code')
    params.append('redirect_uri', redirectUrl)
    params.append('scope', scopes.value.join(' '))
    params.append('code_challenge_method', 'S256')
    params.append('code_challenge', challenge)
    params.append('state', state)

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
  }

  function logout() {
    token.value = ''
    isLoggedIn.value = false
  }

  async function getAccessToken() {
    if (isLoggedIn.value) return
    if (await refreshToken()) return

    const params = new URLSearchParams(window.location.search)
    const state = params.get('state')
    const router = useRouter()

    if (!state) {
      return
    }

    const res = await ky.get<{ access_token: string }>
      (`${import.meta.env.VITE_APP_BACKEND_URL}/token?state=${state}`).json()
    setToken(res.access_token)
    router.replace("/")
  }

  async function refreshToken(): Promise<boolean> {
    try {
      const res = await ky.post<{ access_token: string, expires_in: number}>(
        `${import.meta.env.VITE_APP_BACKEND_URL}/refresh`, 
        { credentials: 'include' }
      ).json()

      setToken(res.access_token)
    } catch {
      return false
    }

    return true
  }

  return { isLoggedIn, scopes, getToken, setToken, login, logout, getAccessToken, refreshToken }
})