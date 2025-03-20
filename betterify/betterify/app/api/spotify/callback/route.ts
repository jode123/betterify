import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL(`/settings?error=${error}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/settings?error=no_code", request.url))
  }

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = "https://betterify.vercel.app/api/spotify/callback"

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("Token exchange failed:", errorData)
      return NextResponse.redirect(new URL(`/settings?error=token_exchange_failed`, request.url))
    }

    const data = await tokenResponse.json()

    if (!data.access_token) {
      console.error("No access token received")
      return NextResponse.redirect(new URL("/settings?error=no_access_token", request.url))
    }

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 3600 * 24 * 7, // 1 week
    }

    const cookieStore = await cookies()

    // Clear any existing cookies first
    cookieStore.delete("spotify_access_token")
    cookieStore.delete("spotify_refresh_token")
    cookieStore.delete("spotify_token_expiry")

    // Set new cookies
    cookieStore.set("spotify_access_token", data.access_token, cookieOptions)
    if (data.refresh_token) {
      cookieStore.set("spotify_refresh_token", data.refresh_token, cookieOptions)
    }

    const expiryTime = Date.now() + data.expires_in * 1000
    cookieStore.set("spotify_token_expiry", expiryTime.toString(), cookieOptions)

    // Log cookie status (for debugging)
    console.log("Cookies set:", {
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token,
      expiryTime: new Date(expiryTime).toISOString(),
    })

    return NextResponse.redirect(new URL("/settings?auth_success=true", request.url))
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.redirect(new URL("/settings?error=server_error", request.url))
  }
}

