import axios from "axios";
import { generateCodeChallenge, generateRandomString } from "./pkce";
import { userStore } from "@/stores/user";
import { useRouter } from "vue-router";

export async function login() {
  if(await refreshAccessToken()) return

  const verifier = generateRandomString(128)
  const challenge = await generateCodeChallenge(verifier)
  const state = generateRandomString(16)

  const client = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID
  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL
  const redirectUrl = import.meta.env.VITE_APP_SPOTIFY_REDIRECT_URL

  const scopes = [
    'user-read-private',
    'user-read-email'
  ]

  const res = await axios.post(`${backendUrl}/session`, {
    code_verifier: verifier,
    state: state,
  })

  console.log(res)

  const params = new URLSearchParams()
  params.append('client_id', client)
  params.append('response_type', 'code')
  params.append('redirect_uri', redirectUrl)
  params.append('scope', scopes.join(' '))
  params.append('code_challenge_method', 'S256')
  params.append('code_challenge', challenge)
  params.append('state', state)

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}

export async function logout() {
  localStorage.removeItem('verifier')
  window.history.replaceState({}, document.title, window.location.pathname)
}

export async function getAccessToken() {
  const params = new URLSearchParams(window.location.search)
  const state = params.get('state')
  const user = userStore()
  const router = useRouter()

  if (!state || user.isLoggedIn) {
    return
  }

  try {
    const res = await axios.get<{ access_token: string }>(`${import.meta.env.VITE_APP_BACKEND_URL}/token?state=${state}`)
    user.setToken(res.data.access_token)
    router.replace("/")
  } catch {
    throw Error("Unable to get access token")
  }
}

export async function refreshAccessToken(): Promise<boolean> {
  const user = userStore()
  try {
    const res = await axios.post<{ access_token: string, expires_in: number}>(`${import.meta.env.VITE_APP_BACKEND_URL}/refresh`, {}, { withCredentials: true})
    user.setToken(res.data.access_token)
  } catch (err) {
    return false
  }

  return true
}