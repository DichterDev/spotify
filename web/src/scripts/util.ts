import type { CurrentUser } from '@/types/spotify'
import { spotify } from './api'

export async function getProfile(): Promise<CurrentUser> {
  const res = await spotify.get<CurrentUser>("me")
  return res.json()
}

export async function getTracks() {}
export async function getPlaylists() {}
export function searchTracks() {}
export function searchPlaylists() {}
export function submit() {}