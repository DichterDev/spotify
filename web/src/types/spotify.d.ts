
interface User {
  display_name: string
  external_urls: ExternalUrl
  followers: {
    href: string,
    total: number
  }
  href: string
  id: string
  images: Image[]
  type: string
  uri: string
}

export interface CurrentUser extends User {
  country: string
  email: string
  explicit_content: {
    filter_enabled: boolean
    filter_locked: boolean
  }
  product: string
}

interface ExternalUrl {
  spotify: string
}

interface Image {
  url: string
  height: number
  width: number
}

interface Owner {
  external_urls: ExternalUrl
  href: string
  id: string
  type: string
  uri: string
  display_name: string
}

interface Artist {
  external_urls: ExternalUrl
  href: string
  id: string
  name: string
  type: string
  uri: string
}

interface Album {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: ExternalUrl
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions: { reason: string }
  type: string
  uri: string
  artists: Artist[]
}

interface Response<T> {
  href: string
  limit: number
  next: string
  offset: number
  previous: string
  total: number
  items: T[]
}

interface SimplifiedPlaylist {
  collaborative: boolean
  description: string
  external_urls: ExternalUrl
  href: string
  id: string
  images: Image[]
  name: string
  owner: Owner
  public: boolean
  snapshot_id: string
  tracks: {
    href: string
    total: number
  }
  type: string
  uri: string
}

interface SavedTrack {
  added_at: string
  track: Track
}

interface Playlist extends SimplifiedPlaylist {
  tracks: Response<PlaylistTrack>
}

interface Track {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: { isrc: string; ean: string; upc: string }
  external_urls: ExternalUrl
  href: string
  id: string
  is_playable: boolean
  linked_from: {}
  restrictions: { reason: string }
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
  is_local: boolean
}

interface PlaylistTrack {
  added_at: string
  added_by: Owner
  is_local: boolean
  track: Track
}
