export function isSpotifyAuthenticated() {
  try {
    if (typeof window === "undefined") return false

    const cookies = document.cookie.split(";").map((c) => c.trim())

    // Check for access token
    const accessToken = cookies.find((c) => c.startsWith("spotify_access_token="))?.split("=")[1]

    // Check for expiry
    const expiry = cookies.find((c) => c.startsWith("spotify_token_expiry="))?.split("=")[1]

    if (!accessToken || !expiry) return false

    // Check if token is still valid
    return Number.parseInt(expiry) > Date.now()
  } catch (error) {
    console.error("Error checking Spotify auth:", error)
    return false
  }
}

