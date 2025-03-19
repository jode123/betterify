import { getAlbumInfo } from "@/lib/lastfm"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const artist = url.searchParams.get("artist")
  const album = url.searchParams.get("album")

  if (!artist || !album) {
    return NextResponse.json({ error: "Artist and album names are required" }, { status: 400 })
  }

  try {
    const albumInfo = await getAlbumInfo(artist, album)

    return NextResponse.json(albumInfo)
  } catch (error) {
    console.error("Error fetching album details:", error)
    return NextResponse.json({ error: "Failed to fetch album details" }, { status: 500 })
  }
}

