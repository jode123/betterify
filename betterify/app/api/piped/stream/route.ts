import { NextResponse } from "next/server"

// Use the public Piped API
const PIPED_API_URL = "https://pipedapi.kavin.rocks"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const videoId = url.searchParams.get("id")

  if (!videoId) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`${PIPED_API_URL}/streams/${videoId}`)

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

    return NextResponse.json({
      audioUrl: bestAudio?.url,
      videoUrl: mediumVideo?.url,
      title: data.title,
      thumbnailUrl: data.thumbnailUrl,
      uploader: data.uploader,
      duration: data.duration,
    })
  } catch (error) {
    console.error("Error getting stream URL:", error)
    return NextResponse.json({ error: "Failed to get stream URL" }, { status: 500 })
  }
}

