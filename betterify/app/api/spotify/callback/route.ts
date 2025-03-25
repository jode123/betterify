import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSpotifyClientId, getSpotifyClientSecret, getSpotifyRedirectUri } from "@/lib/settings"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // Get the state from the cookie
    const cookies = request.headers.get("cookie") || ""
    const stateCookie = cookies.split("; ").find((row) => row.startsWith("spotify_auth_state="))
    const storedState = stateCookie ? stateCookie.split("=")[1] : null

    // Check if there was an error or if the state doesn't match
    if (error) {
      return NextResponse.redirect(`/settings?error=${error}`)
    }

    if (!state || state !== storedState) {
      return NextResponse.redirect("/settings?error=state_mismatch")
    }

    // Exchange the code for an access token
    const clientId = getSpotifyClientId()
    const clientSecret = getSpotifyClientSecret()
    const redirectUri = getSpotifyRedirectUri()

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect("/settings?error=missing_credentials")
    }

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("Token exchange error:", errorData)
      return NextResponse.redirect(`/settings?error=token_exchange_failed`)
    }

    const tokenData = await tokenResponse.json()

    // Get user profile to verify the connection
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!profileResponse.ok) {
      return NextResponse.redirect("/settings?error=profile_fetch_failed")
    }

    const profileData = await profileResponse.json()

    // Store the tokens in the database
    await db.user.update({
      where: { id: session.user.id },
      data: {
        spotifyId: profileData.id,
        spotifyAccessToken: tokenData.access_token,
        spotifyRefreshToken: tokenData.refresh_token,
        spotifyTokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000),
      },
    })

    // Clear the state cookie
    const response = NextResponse.redirect("/settings?success=spotify_connected")
    response.cookies.set("spotify_auth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error in Spotify callback:", error)
    return NextResponse.redirect("/settings?error=callback_error")
  }
}

