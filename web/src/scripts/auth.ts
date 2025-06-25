import axios from "axios";
import { generateCodeChallenge, generateRandomString } from "./pkce";

export async function login() {
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