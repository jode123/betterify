const LASTFM_API_KEY = "e540e79e4d0cd99309768db3e9d26789" // Replace with your Last.fm API key
const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/"

export async function getTopArtists(limit = 10) {
  try {
    const params = new URLSearchParams({
      method: "chart.gettopartists",
      api_key: LASTFM_API_KEY,
      format: "json",
      limit: limit.toString(),
    })

    const response = await fetch(`${LASTFM_API_URL}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch top artists: ${response.status}`)
    }

    const data = await response.json()
    return data.artists?.artist || []
  } catch (error) {
    console.error("Error fetching Last.fm top artists:", error)
    return []
  }
}

export async function getTopTracks(limit = 10) {
  try {
    const params = new URLSearchParams({
      method: "chart.gettoptracks",
      api_key: LASTFM_API_KEY,
      format: "json",
      limit: limit.toString(),
    })

    const response = await fetch(`${LASTFM_API_URL}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch top tracks: ${response.status}`)
    }

    const data = await response.json()
    return data.tracks?.track || []
  } catch (error) {
    console.error("Error fetching Last.fm top tracks:", error)
    return []
  }
}

export async function getArtistInfo(artist: string) {
  try {
    const params = new URLSearchParams({
      method: "artist.getinfo",
      artist,
      api_key: LASTFM_API_KEY,
      format: "json",
    })

    const response = await fetch(`${LASTFM_API_URL}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch artist info: ${response.status}`)
    }

    const data = await response.json()
    return data.artist
  } catch (error) {
    console.error("Error fetching Last.fm artist info:", error)
    return null
  }
}

export async function getArtistTopTracks(artist: string, limit = 10) {
  try {
    const params = new URLSearchParams({
      method: "artist.gettoptracks",
      artist,
      api_key: LASTFM_API_KEY,
      format: "json",
      limit: limit.toString(),
    })

    const response = await fetch(`${LASTFM_API_URL}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch artist top tracks: ${response.status}`)
    }

    const data = await response.json()
    return data.toptracks?.track || []
  } catch (error) {
    console.error("Error fetching Last.fm artist top tracks:", error)
    return []
  }
}

export async function getArtistTopAlbums(artist: string, limit = 10) {
  try {
    const params = new URLSearchParams({
      method: "artist.gettopalbums",
      artist,
      api_key: LASTFM_API_KEY,
      format: "json",
      limit: limit.toString(),
    })

    const response = await fetch(`${LASTFM_API_URL}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch artist top albums: ${response.status}`)
    }

    const data = await response.json()
    return data.topalbums?.album || []
  } catch (error) {
    console.error("Error fetching Last.fm artist top albums:", error)
    return []
  }
}

export async function getAlbumInfo(artist: string, album: string) {
  try {
    const params = new URLSearchParams({
      method: "album.getinfo",
      artist,
      album,
      api_key: LASTFM_API_KEY,
      format: "json",
    })

    const response = await fetch(`${LASTFM_API_URL}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch album info: ${response.status}`)
    }

    const data = await response.json()
    return data.album
  } catch (error) {
    console.error("Error fetching Last.fm album info:", error)
    return null
  }
}

