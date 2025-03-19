import { getTopArtists } from "@/lib/lastfm"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const limit = Number.parseInt(url.searchParams.get("limit") || "10")

  try {
    const artists = await getTopArtists(limit)
    return NextResponse.json(artists)
  } catch (error) {
    console.error("Error fetching top artists:", error)
    return NextResponse.json({ error: "Failed to fetch top artists" }, { status: 500 })
  }
}

