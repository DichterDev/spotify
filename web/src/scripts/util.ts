import type { Response, CurrentUser, SimplifiedPlaylist, Playlist, Track, PlaylistTrack } from '@/types/spotify'
import { spotify } from './api'
import { useEditorStore } from '@/stores/editor'

const editor = useEditorStore()

export async function getProfile(): Promise<CurrentUser> {
  const res = await spotify.get<CurrentUser>("me")
  return res.json()
}

async function getAllTracks(url: string, callback: (tracks: Track[]) => void) {
  const res = await spotify.get(url, { prefixUrl: '' }).json<Response<PlaylistTrack>>()
  const tracks = res.items.map(({ track }) => track).filter(t => t.is_local !== true)
  callback(tracks)
  if (res.next) getAllTracks(res.next, callback)
}

export async function getTracks(id: string, callback?: (tracks: Track[]) => void, limit: number = 50): Promise<Track[]> {
  const res = await spotify.get(`playlists/${id}/tracks?limit=${limit}`).json<Response<PlaylistTrack>>()
  if (callback) {
    getAllTracks(res.next, callback)
  }
  return res.items.map(({ track }) => track).filter(t => t.is_local !== true)
}

export async function getPlaylist(id: string): Promise<Playlist> {
  const res = await spotify.get(`playlists/${id}`).json<Playlist>()
  return res
}
export async function getPlaylists(): Promise<SimplifiedPlaylist[]> {
  const res = await spotify.get<Response<SimplifiedPlaylist>>('me/playlists').json()
  return res.items
}

export function searchTracks(query: string, tracks: Track[]) {
  query = query.toLowerCase()
  if (query.length === 0) return tracks

  const t = tracks.filter(({ name, artists }) => {
    if (name.toLowerCase().includes(query)) {
      return true
    }
    if (artists.some((artist) => artist.name.toLowerCase().includes(query))) {
      return true
    }
    return false
  })

  return t
}

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

  return p
}

export async function submit() {
  const added = editor.added.map(({ uri }) => uri)
  const removed = editor.removed.map(({ uri }) => uri)
  const id = editor.target?.id
  const snapshot = editor.target?.snapshot_id

  if (!id) throw Error("Target playlist ID not found")
  if (!snapshot) throw Error("Target playlist snapshot not found")

  if (added.length) {
    const data = { uris: added }
    await spotify.post(`playlists/${editor.target?.id}/tracks`, { json: data }).json()
  }

  if (removed.length) {
    const data = { tracks: removed.map(uri => ({ uri: uri })), snapshot_id: editor.target?.snapshot_id }
    await spotify.delete(`playlists/${editor.target?.id}/tracks`, { json: data })
  }

  editor.reset()
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}