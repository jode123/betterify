"use client"

import { getSpotifyAuthUrl } from "@/lib/spotify"

export function SpotifyAuthButton() {
  const handleAuth = async () => {
    try {
      const authUrl = await getSpotifyAuthUrl()
      window.location.href = authUrl
    } catch (error) {
      console.error("Auth error:", error)
    }
  }

  return (
    <button onClick={handleAuth} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
      Connect Spotify
    </button>
  )
}

