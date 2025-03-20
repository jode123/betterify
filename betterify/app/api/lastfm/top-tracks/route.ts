import { getTopTracks } from "@/lib/lastfm"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const limit = Number.parseInt(url.searchParams.get("limit") || "10")

  try {
    const tracks = await getTopTracks(limit)
    return NextResponse.json(tracks)
  } catch (error) {
    console.error("Error fetching top tracks:", error)
    return NextResponse.json({ error: "Failed to fetch top tracks" }, { status: 500 })
  }
}

