import type { Response, CurrentUser, SimplifiedPlaylist, Playlist, Track, PlaylistTrack } from '@/types/spotify'
import { spotify } from './api'

export async function getProfile(): Promise<CurrentUser> {
  const res = await spotify.get<CurrentUser>("me")
  return res.json()
}

export async function getTracks(id: string): Promise<Track[]> {
  // TODO: fields and recursion
  const res = await spotify.get(`playlists/${id}/tracks`).json<Response<PlaylistTrack>>()
  return res.items.map(({ track }) => track)
}

export async function getPlaylist(id: string): Promise<Playlist> {
  const res = await spotify.get(`playlists/${id}`).json<Playlist>()
  return res
}
export async function getPlaylists(): Promise<SimplifiedPlaylist[]> {
  const res = await spotify.get<Response<SimplifiedPlaylist>>('me/playlists').json()
  return res.items
}
export function searchTracks() { }
export async function searchPlaylists(query: string, playlists: SimplifiedPlaylist[]): Promise<SimplifiedPlaylist[]> {
  if (query.length === 0) return playlists
  if (isValidUrl(query)) {
    if (!query.includes('spotify') && !query.includes('playlist')) {
      return playlists
    }

    const id = query.split('/')[-1].split('?')[0]
    const playlist = await getPlaylist(id)
    // TODO
  }

  const p = playlists.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))

  if (p.length === 0) return playlists

  return p
}
export function submit() { }

function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}