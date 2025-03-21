const SPOTIFY_API_URL = "https://api.spotify.com/v1"

// Function to check if token is expired and refresh if needed
async function getValidAccessToken() {
  if (typeof window === "undefined") {
    // Server-side, use client credentials flow
    return getAccessToken()
  }

  // Client-side, check for user token
  const accessToken = localStorage.getItem("spotify_access_token")
  const tokenExpiry = localStorage.getItem("spotify_token_expiry")
  const refreshToken = localStorage.getItem("spotify_refresh_token")

  // If we have a valid token, use it
  if (accessToken && tokenExpiry && Number(tokenExpiry) > Date.now()) {
    return accessToken
  }

  // If we have a refresh token, try to refresh
  if (refreshToken) {
    try {
      const clientId = localStorage.getItem("spotify_client_id") || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
      const clientSecret = localStorage.getItem("spotify_client_secret")

      if (!clientId || !clientSecret) {
        throw new Error("Missing Spotify credentials for token refresh")
      }

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }).toString(),
      })

      if (!response.ok) {
        throw new Error("Failed to refresh token")
      }

      const data = await response.json()

      // Save the new tokens
      localStorage.setItem("spotify_access_token", data.access_token)
      localStorage.setItem("spotify_token_expiry", (Date.now() + data.expires_in * 1000).toString())

      // Save the new refresh token if provided
      if (data.refresh_token) {
        localStorage.setItem("spotify_refresh_token", data.refresh_token)
      }

      return data.access_token
    } catch (error) {
      console.error("Error refreshing token:", error)
      // Clear invalid tokens
      localStorage.removeItem("spotify_access_token")
      localStorage.removeItem("spotify_token_expiry")
      localStorage.removeItem("spotify_refresh_token")

      // Fall back to client credentials flow
      return getAccessToken()
    }
  }

  // Fall back to client credentials flow
  return getAccessToken()
}

async function getAccessToken() {
  // Try to get credentials from environment or localStorage
  let clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  let clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  // This will only run on the client side
  if (typeof window !== "undefined") {
    const storedClientId = localStorage.getItem("spotify_client_id")
    const storedClientSecret = localStorage.getItem("spotify_client_secret")

    if (storedClientId && storedClientSecret) {
      clientId = storedClientId
      clientSecret = storedClientSecret
    }
  }

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify API credentials")
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("Token fetch error:", errorData)
    throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function getFeaturedPlaylists() {
  try {
    const accessToken = await getValidAccessToken()

    const response = await fetch(`${SPOTIFY_API_URL}/browse/featured-playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Spotify API error:", errorData)
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Check if the expected structure exists
    if (!data.playlists || !data.playlists.items) {
      console.error("Unexpected API response structure:", data)
      return [] // Return empty array instead of throwing
    }

    return data.playlists.items
  } catch (error) {
    console.error("Error in getFeaturedPlaylists:", error)
    return [] // Return empty array on error
  }
}

// Alternative function to get playlists if the featured endpoint doesn't work
export async function getCategories() {
  try {
    const accessToken = await getValidAccessToken()

    const response = await fetch(`${SPOTIFY_API_URL}/browse/categories?limit=20`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    const data = await response.json()
    return data.categories.items
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getCategoryPlaylists(categoryId: string) {
  try {
    const accessToken = await getValidAccessToken()

    const response = await fetch(`${SPOTIFY_API_URL}/browse/categories/${categoryId}/playlists?limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch category playlists: ${response.status}`)
    }

    const data = await response.json()
    return data.playlists?.items || []
  } catch (error) {
    console.error("Error fetching category playlists:", error)
    return []
  }
}

export async function getPlaylist(playlistId: string) {
  try {
    const accessToken = await getValidAccessToken()

    const response = await fetch(`${SPOTIFY_API_URL}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching playlist:", error)
    throw error
  }
}

export async function getArtist(artistId: string) {
  try {
    const accessToken = await getValidAccessToken()

    const response = await fetch(`${SPOTIFY_API_URL}/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch artist: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching artist:", error)
    throw error
  }
}

export async function getArtistTopTracks(artistId: string, market = "US") {
  try {
    const accessToken = await getValidAccessToken()

    const response = await fetch(`${SPOTIFY_API_URL}/artists/${artistId}/top-tracks?market=${market}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch artist top tracks: ${response.status}`)
    }

    const data = await response.json()
    return data.tracks
  } catch (error) {
    console.error("Error fetching artist top tracks:", error)
    return []
  }
}

export async function searchSpotify(query: string, types = ["track", "artist", "album"]) {
  try {
    const accessToken = await getValidAccessToken()

    const response = await fetch(`${SPOTIFY_API_URL}/search?q=${query}&type=${types.join(",")}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to search Spotify: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error searching Spotify:", error)
    throw error
  }
}

export async function getUserPlaylists(accessToken: string) {
  try {
    const response = await fetch(`${SPOTIFY_API_URL}/me/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user playlists: ${response.status}`)
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error("Error fetching user playlists:", error)
    return []
  }
}

export function getSpotifyAuthUrl() {
  // Get client ID from environment or localStorage
  let clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID

  if (typeof window !== "undefined") {
    const storedClientId = localStorage.getItem("spotify_client_id")
    if (storedClientId) {
      clientId = storedClientId
    }
  }

  if (!clientId) {
    throw new Error("Missing Spotify Client ID")
  }

  // Generate a random state value for security
  const state = Math.random().toString(36).substring(2, 15)

  // Store state in localStorage to verify it when Spotify redirects back
  if (typeof window !== "undefined") {
    localStorage.setItem("spotify_auth_state", state)
  }

  // Define the redirect URI - must match what's registered in Spotify dashboard
  const redirectUri = `${window.location.origin}/api/spotify/callback`

  // Define the scopes (permissions) we need
  const scopes = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-email",
    "user-read-private",
    "user-read-recently-played",
    "user-top-read",
  ].join(" ")

  // Get client secret for passing to callback
  const clientSecret = localStorage.getItem("spotify_client_secret")

  // Construct the authorization URL with parameters
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    state: state,
    scope: scopes,
    stored_state: state, // Pass the state to the callback for verification
  })

  // Add client ID and secret as separate parameters
  if (clientId) params.append("client_id", clientId)
  if (clientSecret) params.append("client_secret", clientSecret)

  return `https://accounts.spotify.com/authorize?${params.toString()}`
}

