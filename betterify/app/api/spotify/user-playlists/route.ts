import { getUserPlaylists } from "@/lib/spotify"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const accessToken = url.searchParams.get("access_token")

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access token" }, { status: 400 })
  }

  try {
    const playlists = await getUserPlaylists(accessToken)
    return NextResponse.json(playlists)
  } catch (error) {
    console.error("Error fetching user playlists:", error)
    return NextResponse.json({ error: "Failed to fetch user playlists" }, { status: 500 })
  }
}

