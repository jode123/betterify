import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const accessToken = url.searchParams.get("access_token")

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access token" }, { status: 400 })
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}

