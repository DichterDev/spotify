import type { Response, CurrentUser, SimplifiedPlaylist, Playlist, Track, PlaylistTrack, SavedTrack } from '@/types/spotify'
import { spotify } from './api'
import { useEditorStore } from '@/stores/editor'

export const likedSongs: SimplifiedPlaylist = {
  collaborative: false,
  description: "",
  external_urls: { spotify: '' },
  href: "",
  id: "liked",
  images: [{ url: 'https://misc.scdn.co/liked-songs/liked-songs-300.jpg', height: 300, width: 300 }],
  name: "Liked Songs",
  owner: { external_urls: { spotify: '' }, href: '', id: '', display_name: '', uri: '', type: '' },
  public: false,
  snapshot_id: "",
  tracks: {
    href: "",
    total: 0
  },
  type: "playlist",
  uri: ""
};

export async function getProfile(): Promise<CurrentUser> {
  const res = await spotify.get<CurrentUser>("me")
  return res.json()
}

async function getAllTracks(url: string, callback: (tracks: Track[]) => void) {
  const res = await spotify.get(url, { prefixUrl: '' }).json<Response<SavedTrack>>()
  const tracks = res.items.map(({ track }) => track).filter(t => t.is_local !== true)
  callback(tracks)
  if (res.next) getAllTracks(res.next, callback)
}

export async function getTracks(id: string, callback?: (tracks: Track[]) => void, limit: number = 50): Promise<Track[]> {
  let url = `playlists/${id}/tracks?limit=${limit}`
  if (id === 'liked') url = `me/tracks?limit=${limit}`
  const res = await spotify.get(url).json<Response<SavedTrack>>()
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

export function searchPlaylists(query: string, playlists: SimplifiedPlaylist[]): SimplifiedPlaylist[] {
  if (query.length === 0) return playlists
  const p = playlists.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
  return p
}

export async function submit() {
  const editor = useEditorStore()
  const added = editor.added.map(({ uri }) => uri)
  const removed = editor.removed.map(({ uri }) => uri)
  const id = editor.target?.id
  const snapshot = editor.target?.snapshot_id

  if (!editor.target) throw new Error("No target playlist selected")
  if (!id) throw new Error("Target playlist ID not found")
  if (!snapshot) throw new Error("Target playlist snapshot not found")

  if (added.length) {
    const data = { uris: added }
    const res = await spotify.post(`playlists/${editor.target?.id}/tracks`, { json: data }).json<{ snapshot_id: string }>()
    editor.target.snapshot_id = res.snapshot_id
  }

  if (removed.length) {
    const data = { tracks: removed.map(uri => ({ uri: uri })), snapshot_id: editor.target?.snapshot_id }
    const res = await spotify.delete(`playlists/${editor.target?.id}/tracks`, { json: data }).json<{ snapshot_id: string }>()
    editor.target.snapshot_id = res.snapshot_id
  }

  editor.reset()
}

export function getPlaylistID(url: string): string {
  if (!isValidUrl(url)) return ''
  if (!url.includes('spotify')) return ''
  if (!url.includes('playlist')) return ''

  const urlObj = new URL(url)
  const sub = urlObj.pathname.split('/')
  return sub[2]
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}