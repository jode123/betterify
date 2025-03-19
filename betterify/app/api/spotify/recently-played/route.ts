import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const accessToken = url.searchParams.get("access_token")

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access token" }, { status: 400 })
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=10", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch recently played: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching recently played:", error)
    return NextResponse.json({ error: "Failed to fetch recently played" }, { status: 500 })
  }
}

