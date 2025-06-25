export interface Response<T> {
  href: string
  limit: number
  next: string
  offset: number
  previous: string
  total: number
  items: T[]
}

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