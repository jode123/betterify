export interface Song {
  id: string
  title: string
  artist: string
  album?: string
  thumbnailUrl: string
  videoId: string
  duration: number
}

export interface Playlist {
  id: string
  name: string
  description?: string
  songs: Song[]
  createdAt: number
  updatedAt: number
}

// Generate a unique ID with timestamp and random string
function generateUniqueId(prefix = "playlist"): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${randomStr}`
}

// Get all playlists from local storage
export function getPlaylists(): Playlist[] {
  // Fallback to localStorage
  if (typeof window === "undefined") return []

  const playlistsJson = localStorage.getItem("user_playlists")
  if (!playlistsJson) return []

  try {
    return JSON.parse(playlistsJson)
  } catch (error) {
    console.error("Error parsing playlists:", error)
    return []
  }
}

// Get a specific playlist by ID
export function getPlaylist(id: string): Playlist | null {
  const playlists = getPlaylists()
  return playlists.find((p) => p.id === id) || null
}

// Create a new playlist
export function createPlaylist(name: string, description?: string): Playlist {
  const playlists = getPlaylists()

  const newPlaylist: Playlist = {
    id: generateUniqueId(),
    name,
    description,
    songs: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  playlists.push(newPlaylist)
  savePlaylists(playlists)

  return newPlaylist
}

// Update a playlist
export function updatePlaylist(id: string, updates: Partial<Playlist>): Playlist | null {
  const playlists = getPlaylists()
  const index = playlists.findIndex((p) => p.id === id)

  if (index === -1) return null

  const updatedPlaylist = {
    ...playlists[index],
    ...updates,
    updatedAt: Date.now(),
  }

  playlists[index] = updatedPlaylist
  savePlaylists(playlists)

  return updatedPlaylist
}

// Delete a playlist
export function deletePlaylist(id: string): boolean {
  const playlists = getPlaylists()
  const filteredPlaylists = playlists.filter((p) => p.id !== id)

  if (filteredPlaylists.length === playlists.length) return false

  savePlaylists(filteredPlaylists)
  return true
}

// Add a song to a playlist
export function addSongToPlaylist(playlistId: string, song: Song): boolean {
  const playlists = getPlaylists()
  const index = playlists.findIndex((p) => p.id === playlistId)

  if (index === -1) return false

  // Generate a unique ID for the song
  const songWithUniqueId = {
    ...song,
    id: generateUniqueId("song"),
  }

  // Check if song already exists in playlist (by videoId, not by ID)
  const songExists = playlists[index].songs.some((s) => s.videoId === songWithUniqueId.videoId)
  if (songExists) return true

  playlists[index].songs.push(songWithUniqueId)
  playlists[index].updatedAt = Date.now()

  savePlaylists(playlists)
  return true
}

// Remove a song from a playlist
export function removeSongFromPlaylist(playlistId: string, songId: string): boolean {
  const playlists = getPlaylists()
  const index = playlists.findIndex((p) => p.id === playlistId)

  if (index === -1) return false

  const originalLength = playlists[index].songs.length
  playlists[index].songs = playlists[index].songs.filter((s) => s.id !== songId)

  if (playlists[index].songs.length === originalLength) return false

  playlists[index].updatedAt = Date.now()
  savePlaylists(playlists)

  return true
}

// Save playlists to local storage
function savePlaylists(playlists: Playlist[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("user_playlists", JSON.stringify(playlists))

  // Dispatch a storage event to notify other components
  window.dispatchEvent(new Event("storage"))
}

// Liked Songs functionality
export function getLikedSongs(): Song[] {
  if (typeof window === "undefined") return []

  const likedSongsJson = localStorage.getItem("liked_songs")
  if (!likedSongsJson) return []

  try {
    return JSON.parse(likedSongsJson)
  } catch (error) {
    console.error("Error parsing liked songs:", error)
    return []
  }
}

export function isLikedSong(songId: string): boolean {
  const likedSongs = getLikedSongs()
  return likedSongs.some((s) => s.videoId === songId || s.id === songId)
}

export function toggleLikeSong(song: Song): boolean {
  const likedSongs = getLikedSongs()

  // Generate a unique ID for the song if it doesn't have one
  const songWithUniqueId = {
    ...song,
    id: song.id || generateUniqueId("song"),
  }

  // Check if the song is already liked by videoId (more reliable than id)
  const isLiked = likedSongs.some((s) => s.videoId === songWithUniqueId.videoId)

  if (isLiked) {
    // Unlike the song
    const updatedLikedSongs = likedSongs.filter((s) => s.videoId !== songWithUniqueId.videoId)
    saveLikedSongs(updatedLikedSongs)
    return false
  } else {
    // Like the song
    likedSongs.push(songWithUniqueId)
    saveLikedSongs(likedSongs)
    return true
  }
}

function saveLikedSongs(songs: Song[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("liked_songs", JSON.stringify(songs))

  // Dispatch a storage event to notify other components
  window.dispatchEvent(new Event("storage"))
}

// Initialize default playlists if none exist
export function initializeDefaultPlaylists(): void {
  const playlists = getPlaylists()

  if (playlists.length === 0) {
    // Create a "Liked Songs" playlist
    createPlaylist("Liked Songs", "Your favorite songs")

    // Create a "Discover Weekly" playlist
    createPlaylist("Discover Weekly", "New music recommendations for you")
  }
}

