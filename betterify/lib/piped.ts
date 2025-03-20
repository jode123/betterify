// Local Piped instance running in Docker or public instance
const PIPED_API_URL = process.env.NEXT_PUBLIC_PIPED_API_URL || "https://pipedapi.kavin.rocks"
const PIPED_PROXY_URL = process.env.NEXT_PUBLIC_PIPED_PROXY_URL || "https://pipedproxy.kavin.rocks"

export async function searchPiped(query: string, filter = "music") {
  try {
    // Use environment variable for API URL
    const apiUrl = PIPED_API_URL
    const response = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query)}&filter=${filter}`)

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
    // Use environment variable for API URL
    const apiUrl = PIPED_API_URL
    const response = await fetch(`${apiUrl}/streams/${videoId}`)

    if (!response.ok) {
      throw new Error(`Failed to get stream URL: ${response.status}`)
    }

    const data = await response.json()

    // Find audio stream with highest quality
    const audioStreams = data.audioStreams || []
    const bestAudio = audioStreams.sort((a: any, b: any) => Number.parseInt(b.bitrate) - Number.parseInt(a.bitrate))[0]

    // Find video stream with medium quality (for performance)
    const videoStreams = data.videoStreams || []
    const mediumVideo =
      videoStreams.find((s: any) => s.quality === "720p") ||
      videoStreams.find((s: any) => s.quality === "480p") ||
      videoStreams[0]

    return {
      audioUrl: bestAudio?.url,
      videoUrl: mediumVideo?.url,
      thumbnailUrl: data.thumbnailUrl,
      uploader: data.uploader,
      duration: data.duration,
      videoId: videoId,
    }
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

// Function to get direct stream URLs from Piped
export function getProxiedStreamUrl(url: string) {
  if (!url) return url

  // If the URL is already proxied, return it
  if (url.includes(PIPED_PROXY_URL)) return url

  // Otherwise, proxy it through Piped
  return `${PIPED_PROXY_URL}/proxy/${encodeURIComponent(url)}`
}

