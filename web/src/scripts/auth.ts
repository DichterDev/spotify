import { generateCodeChallenge, generateCodeVerifier } from "./pkce";

export async function login() {
  const verifier = generateCodeVerifier(128)
  const challenge = await generateCodeChallenge(verifier)
  const client = ''

  localStorage.setItem('verifier', verifier)

  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
  ].join(' ')

  const params = new URLSearchParams()
  params.append('client_id', client)
  params.append('response_type', 'code')
  params.append('redirect_uri', 'https://spotify.dichter.dev')
  params.append('scope', scopes)
  params.append('code_challenge_method', 'S256')
  params.append('code_challenge', challenge)

  return `https://accounts.spotify.com/authorize?${params.toString()}`
}
export async function logout() {
  localStorage.removeItem('verifier')
  window.history.replaceState({}, document.title, window.location.pathname)
}