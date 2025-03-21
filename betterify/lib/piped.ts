// Use the environment variables for Piped API URLs
const PIPED_API_URL = process.env.NEXT_PUBLIC_PIPED_API_URL || "https://pipedapi.kavin.rocks"
const PIPED_PROXY_URL = process.env.NEXT_PUBLIC_PIPED_PROXY_URL || "https://pipedproxy.kavin.rocks"

// Helper function to sanitize search terms
function sanitizeSearchTerm(term: string): string {
  if (!term) return ""

  // Remove special characters that might interfere with search
  return term
    .replace(/[^\w\s]/gi, " ") // Replace special chars with spaces
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim()
}

export async function searchPiped(query: string, filter = "music") {
  try {
    // Sanitize the query
    const sanitizedQuery = sanitizeSearchTerm(query)

    if (!sanitizedQuery) {
      console.error("Empty query after sanitization")
      return []
    }

    console.log(`Searching Piped for: "${sanitizedQuery}"`)

    // Use server-side API route instead of direct fetch to avoid CORS issues
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(`/api/piped/search?q=${encodeURIComponent(sanitizedQuery)}&filter=${filter}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Even if the response is not OK, try to parse it anyway
    // Our API route should return an empty array instead of throwing
    const data = await response.json()

    if (!Array.isArray(data)) {
      console.error("Invalid response format from Piped search:", data)
      return []
    }

    return data
  } catch (error) {
    console.error("Error searching Piped:", error)
    return []
  }
}

export async function getStreamUrl(videoId: string) {
  try {
    if (!videoId) {
      console.error("No videoId provided to getStreamUrl")
      return null
    }

    console.log(`Getting stream URL for video ID: ${videoId}`)

    // Use server-side API route instead of direct fetch
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(`/api/piped/stream?id=${videoId}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`Failed to get stream URL: ${response.status}`)
      return null
    }

    const data = await response.json()

    if (!data || !data.audioUrl) {
      console.error("No audio URL in stream data:", data)
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting stream URL:", error)
    return null
  }
}

// Function to search for a track on Piped with improved error handling and fallbacks
export async function searchTrackOnPiped(artist: string, track: string, album?: string) {
  try {
    // Sanitize inputs
    const sanitizedArtist = sanitizeSearchTerm(artist)
    const sanitizedTrack = sanitizeSearchTerm(track)
    const sanitizedAlbum = album ? sanitizeSearchTerm(album) : ""

    if (!sanitizedArtist && !sanitizedTrack) {
      throw new Error("No valid search terms provided")
    }

    // Try different search queries in order of specificity
    const searchQueries = [
      `${sanitizedArtist} ${sanitizedTrack}`, // Artist + Track
      `${sanitizedTrack} ${sanitizedArtist}`, // Track + Artist
      `${sanitizedTrack} ${sanitizedArtist} official`, // Track + Artist + official
      `${sanitizedTrack} ${sanitizedArtist} audio`, // Track + Artist + audio
      sanitizedTrack, // Just Track
      `${sanitizedTrack} official audio`, // Track + official audio
      `${sanitizedTrack} official`, // Track + official
      `${sanitizedTrack} audio`, // Track + audio
      `${sanitizedTrack} ${sanitizedAlbum}`, // Track + Album
      `${sanitizedArtist} music`, // Artist + music
      `${sanitizedArtist} official`, // Artist + official
    ].filter((q) => q.trim() !== "") // Remove any empty queries

    // Try each query until we get results
    let results = []
    for (const query of searchQueries) {
      console.log(`Trying search query: "${query}"`)
      results = await searchPiped(query)

      if (results && results.length > 0) {
        console.log(`Found ${results.length} results with query: "${query}"`)
        break
      }
    }

    if (!results || results.length === 0) {
      throw new Error("No results found after trying multiple search queries")
    }

    // Get the first result
    const result = results[0]
    const videoId = result.url.split("v=")[1] || result.url.split("/").pop()

    if (!videoId) {
      throw new Error("Could not extract video ID from result URL")
    }

    // Get the stream URL
    const streamData = await getStreamUrl(videoId)

    if (!streamData || !streamData.audioUrl) {
      throw new Error("Failed to get stream data")
    }

    return {
      title: track,
      artist: artist,
      album: album,
      thumbnailUrl: streamData.thumbnailUrl || result.thumbnailUrl,
      audioUrl: streamData.audioUrl,
      videoUrl: streamData.videoUrl,
      videoId: videoId,
      duration: streamData.duration || 0,
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

