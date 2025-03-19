import { getArtistInfo, getArtistTopTracks, getArtistTopAlbums } from "@/lib/lastfm"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const artist = url.searchParams.get("name")

  if (!artist) {
    return NextResponse.json({ error: "Artist name is required" }, { status: 400 })
  }

  try {
    const [artistInfo, topTracks, topAlbums] = await Promise.all([
      getArtistInfo(artist),
      getArtistTopTracks(artist, 10),
      getArtistTopAlbums(artist, 12),
    ])

    return NextResponse.json({
      artistInfo,
      topTracks,
      topAlbums,
    })
  } catch (error) {
    console.error("Error fetching artist details:", error)
    return NextResponse.json({ error: "Failed to fetch artist details" }, { status: 500 })
  }
}

