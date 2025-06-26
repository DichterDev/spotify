import type { Response, CurrentUser, SimplifiedPlaylist } from '@/types/spotify'
import { spotify } from './api'

export async function getProfile(): Promise<CurrentUser> {
  const res = await spotify.get<CurrentUser>("me")
  return res.json()
}

export async function getTracks() {}
export async function getPlaylists(): Promise<SimplifiedPlaylist[]> {
  const res = await spotify.get<Response<SimplifiedPlaylist>>('me/playlists').json()
  return res.items
}
export function searchTracks() {}
export function searchPlaylists() {}
export function submit() {}