export interface AlbumTrack {
  name: string
  artist: string
  duration: string
}

export interface AlbumDetails {
  name: string
  artist: string
  image: string
  tracks: AlbumTrack[]
}