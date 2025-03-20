import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const state = Math.random().toString(36).substring(7)
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/callback`
  const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private'

  // Set state cookie with appropriate options
  const cookieStore = await cookies()
  cookieStore.set('spotify_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600 // 1 hour
  })

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId!,
    scope,
    redirect_uri: redirectUri,
    state
  })

  // Return the URL instead of redirecting
  return NextResponse.json({ 
    url: `https://accounts.spotify.com/authorize?${params.toString()}`
  })
}