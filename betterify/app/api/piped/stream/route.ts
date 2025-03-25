import { NextResponse } from "next/server"

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

export async function GET(request: Request) {
  const url = new URL(request.url)
  const videoId = url.searchParams.get("videoId")

  if (!videoId) {
    return NextResponse.json({ error: "videoId parameter is required" }, { status: 400 })
  }

  console.log(`[SERVER] Fetching stream info for video: ${videoId}`)

  // Try each Piped API instance until one works
  for (const apiInstance of PIPED_API_INSTANCES) {
    try {
      console.log(`[SERVER] Trying Piped API: ${apiInstance} for video: ${videoId}`)

      // Set a timeout for the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${apiInstance}/streams/${videoId}`, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        cache: "no-store",
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.log(`[SERVER] Failed with API ${apiInstance}: ${response.status}`)
        continue // Try the next API instance
      }

      const data = await response.json()

      // Check if we got valid stream data
      if (data && (data.audioStreams || data.videoStreams)) {
        console.log(`[SERVER] Success with API ${apiInstance}, found stream data`)
        return NextResponse.json(data)
      } else {
        console.log(`[SERVER] Success with API ${apiInstance}, but no valid stream data`)
        // If we got a successful response but no valid data, try the next instance
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log(`[SERVER] Request to ${apiInstance} timed out`)
      } else {
        console.log(`[SERVER] Error with API ${apiInstance}:`, error.message)
      }
      // Continue to the next API instance
    }
  }

  console.log(`[SERVER] All Piped APIs failed, returning error`)
  // If all APIs failed, return an error
  return NextResponse.json({ error: "Failed to fetch stream data from any Piped instance" }, { status: 502 })
}

