import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSpotifyClientId, getSpotifyRedirectUri } from "@/lib/settings"

export async function GET(request: Request) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const clientId = getSpotifyClientId()
    const redirectUri = getSpotifyRedirectUri()

    if (!clientId || !redirectUri) {
      return NextResponse.json({ error: "Spotify API credentials not configured" }, { status: 400 })
    }

    // Generate a random state value for security
    const state = Math.random().toString(36).substring(2, 15)

    // Store the state in a cookie for verification in the callback
    const response = NextResponse.redirect(
      `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=user-read-private%20user-read-email%20playlist-read-private%20user-library-read`,
    )

    response.cookies.set("spotify_auth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 5, // 5 minutes
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error in Spotify authorization:", error)
    return NextResponse.json({ error: "Failed to authorize with Spotify" }, { status: 500 })
  }
}

