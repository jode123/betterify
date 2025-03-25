const BASE_URL = "https://ws.audioscrobbler.com/2.0/"

// Helper function to get the Last.fm API key
function getLastfmApiKey(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lastfm_api_key") || process.env.LASTFM_API_KEY || ""
  }
  return process.env.LASTFM_API_KEY || ""
}

export async function getTopArtists(limit = 10) {
  try {
    const apiKey = getLastfmApiKey()

    if (!apiKey) {
      console.error("Last.fm API key not found")
      return []
    }

    const params = new URLSearchParams({
      method: "chart.gettopartists",
      api_key: apiKey,
      format: "json",
      limit: limit.toString(),
    })

    const response = await fetch(`${BASE_URL}?${params.toString()}`)

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
    const apiKey = getLastfmApiKey()

    if (!apiKey) {
      console.error("Last.fm API key not found")
      return []
    }

    const params = new URLSearchParams({
      method: "chart.gettoptracks",
      api_key: apiKey,
      format: "json",
      limit: limit.toString(),
    })

    const response = await fetch(`${BASE_URL}?${params.toString()}`)

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
    const apiKey = getLastfmApiKey()

    if (!apiKey) {
      console.error("Last.fm API key not found")
      return null
    }

    const params = new URLSearchParams({
      method: "artist.getinfo",
      artist,
      api_key: apiKey,
      format: "json",
    })

    const response = await fetch(`${BASE_URL}?${params.toString()}`)

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
    const apiKey = getLastfmApiKey()

    if (!apiKey) {
      console.error("Last.fm API key not found")
      return []
    }

    const params = new URLSearchParams({
      method: "artist.gettoptracks",
      artist,
      api_key: apiKey,
      format: "json",
      limit: limit.toString(),
    })

    const response = await fetch(`${BASE_URL}?${params.toString()}`)

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
    const apiKey = getLastfmApiKey()

    if (!apiKey) {
      console.error("Last.fm API key not found")
      return []
    }

    const params = new URLSearchParams({
      method: "artist.gettopalbums",
      artist,
      api_key: apiKey,
      format: "json",
      limit: limit.toString(),
    })

    const response = await fetch(`${BASE_URL}?${params.toString()}`)

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
    const apiKey = getLastfmApiKey()

    if (!apiKey) {
      console.error("Last.fm API key not found")
      return null
    }

    const params = new URLSearchParams({
      method: "album.getinfo",
      artist,
      album,
      api_key: apiKey,
      format: "json",
    })

    const response = await fetch(`${BASE_URL}?${params.toString()}`)

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

