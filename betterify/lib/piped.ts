// Use the public Piped API instead of local Docker
const PIPED_API_URL = "https://pipedapi.kavin.rocks"
const PIPED_PROXY_URL = "https://pipedproxy.kavin.rocks"

export async function searchPiped(query: string, filter = "music") {
  try {
    const response = await fetch(`${PIPED_API_URL}/search?q=${encodeURIComponent(query)}&filter=${filter}`)

    if (!response.ok) {
      throw new Error(`Failed to search Piped: ${response.status}`)
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error("Error searching Piped:", error)
    return []
  }
}

export async function getStreamUrl(videoId: string) {
  try {
    const response = await fetch(`${PIPED_API_URL}/streams/${videoId}`)

    if (!response.ok) {
      throw new Error(`Failed to get stream URL: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error getting stream URL:", error)
    return null
  }
}

// Function to search for a track on Piped
export async function searchTrackOnPiped(artist: string, track: string, album?: string) {
  try {
    const searchQuery = `${artist} ${track} ${album || ""}`
    const results = await searchPiped(searchQuery)

    if (results.length === 0) {
      throw new Error("No results found")
    }

    // Get the first result
    const videoId = results[0].url.split("v=")[1] || results[0].url.split("/").pop()

    // Get the stream URL
    const streamData = await getStreamUrl(videoId)

    if (!streamData) {
      throw new Error("Failed to get stream data")
    }

    return {
      title: track,
      artist: artist,
      album: album,
      thumbnailUrl: streamData.thumbnailUrl,
      audioUrl: streamData.audioUrl,
      videoUrl: streamData.videoUrl,
      videoId: videoId,
      duration: streamData.duration,
    }
  } catch (error) {
    console.error("Error searching track on Piped:", error)
    throw error
  }
}

// Function to ensure stream URLs are properly formatted
export function ensureProperStreamUrl(url: string) {
  if (!url) return url

  // If the URL is already a full URL, return it
  if (url.startsWith("http")) return url

  // If it's a relative URL, prepend the proxy URL
  return `${PIPED_PROXY_URL}${url.startsWith("/") ? url : "/" + url}`
}

