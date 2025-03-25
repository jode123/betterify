// Function to get stream URL from Piped
export async function getStreamUrl(videoId: string) {
  try {
    console.log(`Getting stream URL for video ID: ${videoId}`)

    // List of Piped API instances to try
    const PIPED_API_INSTANCES = [
      process.env.NEXT_PUBLIC_PIPED_API_URL || "https://pipedapi.kavin.rocks",
      "https://pipedapi.kavin.rocks",
      "https://pipedapi.tokhmi.xyz",
      "https://pipedapi.moomoo.me",
      "https://pipedapi.syncpundit.io",
      "https://api-piped.mha.fi",
      "https://piped-api.garudalinux.org",
      "https://pipedapi.in.projectsegfau.lt",
      "https://pipedapi.leptons.xyz",
    ]

    // Try each Piped API instance until one works
    for (const apiInstance of PIPED_API_INSTANCES) {
      try {
        console.log(`[CLIENT] Trying Piped API: ${apiInstance} for video ID: ${videoId}`)

        // Set a timeout for the fetch request
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(`${apiInstance}/streams/${videoId}`, {
          signal: controller.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          console.log(`[CLIENT] Failed with API ${apiInstance}: ${response.status}`)
          continue // Try the next API instance
        }

        const data = await response.json()

        // Check if we got valid stream data
        if (!data || (!data.audioStreams && !data.audioOnlyStreams)) {
          console.log(`[CLIENT] Success with API ${apiInstance}, but no audio streams found`)
          continue // Try the next API instance
        }

        // Get the best audio stream
        const audioStreams = data.audioOnlyStreams || data.audioStreams || []
        const bestAudioStream = audioStreams.sort((a: any, b: any) => b.bitrate - a.bitrate)[0]

        // Get the best video stream
        const videoStreams = data.videoStreams || []
        const bestVideoStream = videoStreams.sort((a: any, b: any) => b.quality - a.quality)[0]

        console.log(`[CLIENT] Success with API ${apiInstance}, found audio and video streams`)

        return {
          audioUrl: bestAudioStream?.url,
          videoUrl: bestVideoStream?.url,
          thumbnailUrl: data.thumbnailUrl,
          title: data.title,
          uploader: data.uploader,
          duration: data.duration,
          videoId,
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log(`[CLIENT] Request to ${apiInstance} timed out`)
        } else {
          console.log(`[CLIENT] Error with API ${apiInstance}:`, error.message)
        }
        // Continue to the next API instance
      }
    }

    console.log(`[CLIENT] All Piped APIs failed for video ID: ${videoId}`)
    throw new Error("Failed to get stream URL from any Piped API instance")
  } catch (error) {
    console.error("Error getting stream URL:", error)
    throw error
  }
}

// Function to search for a track on Piped
export async function searchTrackOnPiped(artist: string, track: string, album?: string) {
  try {
    console.log(`Searching for track: ${artist} - ${track}${album ? ` (${album})` : ""}`)

    // Generate search queries to try
    const queries = [
      `${artist} ${track}`,
      `${artist} ${track} audio`,
      `${artist} ${track} official`,
      `${artist} - ${track}`,
      `${track} by ${artist}`,
    ]

    if (album) {
      queries.push(`${artist} ${track} ${album}`)
    }

    // Try each query until we get results
    for (const query of queries) {
      try {
        console.log(`[CLIENT] Trying search query: "${query}"`)

        const response = await fetch(`/api/piped/search?q=${encodeURIComponent(query)}&filter=music`)

        if (!response.ok) {
          console.log(`[CLIENT] Search failed: ${response.status}`)
          continue // Try the next query
        }

        const data = await response.json()

        // Check if we got any results
        if (!data.items || data.items.length === 0) {
          console.log(`[CLIENT] No results found for query: "${query}"`)
          continue // Try the next query
        }

        console.log(`[CLIENT] Found ${data.items.length} results for query: "${query}"`)

        // Get the first result
        const firstResult = data.items[0]

        // Get the video ID
        const videoId = firstResult.url.split("v=")[1] || firstResult.url.split("/").pop()

        // Get the stream URL
        const streamData = await getStreamUrl(videoId)

        return streamData
      } catch (error) {
        console.log(`[CLIENT] Error searching with query "${query}":`, error.message)
        // Continue to the next query
      }
    }

    console.log(`[CLIENT] All search queries failed for track: ${artist} - ${track}`)
    throw new Error("No results found after trying multiple search queries")
  } catch (error) {
    console.error("Error searching track on Piped:", error)
    throw error
  }
}

// Function to search on Piped
export async function searchPiped(query: string) {
  try {
    console.log(`[CLIENT] Searching Piped for: "${query}"`)

    const response = await fetch(`/api/piped/search?q=${encodeURIComponent(query)}&filter=music`)

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items) {
      console.log(`[CLIENT] Invalid response format from Piped search:`, data)
      throw new Error("Invalid response format from Piped search")
    }

    return data.items || []
  } catch (error) {
    console.error("Error searching on Piped:", error)
    return []
  }
}

// Function to ensure proper stream URL
export function ensureProperStreamUrl(url: string) {
  // Some Piped instances return URLs with escaped characters
  return url.replace(/&amp;/g, "&")
}

