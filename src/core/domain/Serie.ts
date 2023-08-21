import type { Thumbnail } from './Thumbnail'

export interface Serie {
  id: string
  endYear: number
  modified?: string
  rating?: string
  startYear: number
  title?: string
  type?: string
  characters: any
  comics: any
  creators: any
  events: any
  stories: any
  thumbnail: Thumbnail
  urls: any
  isSaved?: any
  description?: string
}
