"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Music, User } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PlaylistImage {
  url: string
  height?: number
  width?: number
}

interface Playlist {
  id: string
  name: string
  images: PlaylistImage[]
  description?: string
}

interface LastFmArtist {
  name: string
  listeners: string
  mbid?: string
  url: string
  image: { "#text": string; size: string }[]
}

interface LastFmTrack {
  name: string
  artist: {
    name: string
    mbid?: string
    url: string
  }
  url: string
  listeners: string
  image: { "#text": string; size: string }[]
}

export function MainContent() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsCredentials, setNeedsCredentials] = useState(false)
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // State for recently played tracks
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([])
  const [isLoadingRecent, setIsLoadingRecent] = useState(false)

  // State for Last.fm data
  const [topArtists, setTopArtists] = useState<LastFmArtist[]>([])
  const [topTracks, setTopTracks] = useState<LastFmTrack[]>([])
  const [isLoadingLastFm, setIsLoadingLastFm] = useState(false)

  const placeholder = "/placeholder.svg?height=150&width=150"

  // Check for authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("spotify_access_token")
      const tokenExpiry = localStorage.getItem("spotify_token_expiry")

      if (accessToken && tokenExpiry && Number(tokenExpiry) > Date.now()) {
        setIsAuthenticated(true)
        return true
      }
      return false
    }

    // Initial check
    const isAuth = checkAuth()

    // Set up a timer to check periodically (every minute)
    const authCheckInterval = setInterval(() => {
      checkAuth()
    }, 60000)

    return () => clearInterval(authCheckInterval)
  }, [])

  // Fetch Spotify playlists only if authenticated
  useEffect(() => {
    async function fetchPlaylists() {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch("/api/spotify/playlists")

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          if (response.status === 401 || errorData.error?.includes("credentials")) {
            setNeedsCredentials(true)
            return
          }
          throw new Error("Failed to fetch playlists")
        }

        const fetchedPlaylists = await response.json()

        if (!Array.isArray(fetchedPlaylists)) {
          console.error("Unexpected response format:", fetchedPlaylists)
          throw new Error("Invalid response format")
        }

        setPlaylists(fetchedPlaylists)
      } catch (err) {
        setError("Failed to fetch playlists. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaylists()
  }, [isAuthenticated])

  // Fetch recently played tracks only if authenticated
  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      const accessToken = localStorage.getItem("spotify_access_token")

      if (!accessToken) return

      try {
        setIsLoadingRecent(true)
        const response = await fetch(`/api/spotify/recently-played?access_token=${accessToken}`)

        if (!response.ok) {
          throw new Error("Failed to fetch recently played")
        }

        const data = await response.json()
        setRecentlyPlayed(data.items || [])
      } catch (error) {
        console.error("Error fetching recently played:", error)
      } finally {
        setIsLoadingRecent(false)
      }
    }

    if (isAuthenticated) {
      fetchRecentlyPlayed()
    } else {
      setIsLoadingRecent(false)
    }
  }, [isAuthenticated])

  // Always fetch Last.fm data regardless of authentication status
  useEffect(() => {
    const fetchLastFmData = async () => {
      try {
        setIsLoadingLastFm(true)

        // Fetch top artists
        const artistsResponse = await fetch("/api/lastfm/top-artists?limit=12")
        if (!artistsResponse.ok) {
          throw new Error("Failed to fetch top artists")
        }
        const artistsData = await artistsResponse.json()
        setTopArtists(artistsData)

        // Fetch top tracks
        const tracksResponse = await fetch("/api/lastfm/top-tracks?limit=12")
        if (!tracksResponse.ok) {
          throw new Error("Failed to fetch top tracks")
        }
        const tracksData = await tracksResponse.json()
        setTopTracks(tracksData)
      } catch (error) {
        console.error("Error fetching Last.fm data:", error)
      } finally {
        setIsLoadingLastFm(false)
      }
    }

    fetchLastFmData()
  }, [])

  // Only show loading state if Last.fm data is still loading
  // Don't wait for Spotify data if not authenticated
  const isPageLoading = isLoadingLastFm || (isAuthenticated && (isLoading || isLoadingRecent))

  if (isPageLoading) {
    return <div className="flex-1 p-8 flex items-center justify-center">Loading...</div>
  }

  if (needsCredentials) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Spotify API Credentials Required</h3>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
            To use this app, you need to add your Spotify API credentials in the settings.
          </p>
        </div>
        <Button onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Go to Settings
        </Button>
      </div>
    )
  }

  if (error) {
    return <div className="flex-1 p-8 flex items-center justify-center text-red-500">{error}</div>
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-neutral-900">
      {!isAuthenticated && (
        <div className="mb-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Connect Your Spotify Account</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Connect your Spotify account to see your personal playlists and recently played tracks.
          </p>
          <Button onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Connect in Settings
          </Button>
        </div>
      )}

      {/* Last.fm Top Artists - Always show regardless of authentication */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Top Artists on Last.fm</h2>
          <User className="text-neutral-500" size={24} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {topArtists.map((artist) => (
            <Link href={`/lastfm/artist/${encodeURIComponent(artist.name)}`} key={artist.name}>
              <Card className="overflow-hidden bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow theme-glow-hover">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={artist.image.find((img) => img.size === "extralarge")?.["#text"] || placeholder}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{artist.name}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      {Number.parseInt(artist.listeners).toLocaleString()} listeners
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Last.fm Top Tracks - Always show regardless of authentication */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Top Tracks on Last.fm</h2>
          <Music className="text-neutral-500" size={24} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {topTracks.map((track) => (
            <Link
              href={`/lastfm/album/${encodeURIComponent(track.artist.name)}/${encodeURIComponent(track.name)}`}
              key={track.name}
            >
              <Card className="overflow-hidden bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow theme-glow-hover">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={track.image.find((img) => img.size === "extralarge")?.["#text"] || placeholder}
                      alt={track.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{track.name}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 truncate">{track.artist.name}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Playlists - Only show when authenticated */}
      {isAuthenticated && playlists.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Featured Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <Link href={`/playlist/${playlist.id}`} key={playlist.id}>
                <Card className="overflow-hidden bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow theme-glow-hover">
                  <CardContent className="p-0">
                    <Image
                      src={playlist.images?.[0]?.url || placeholder}
                      alt={playlist.name}
                      width={150}
                      height={150}
                      className="w-full"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold truncate">{playlist.name}</h3>
                      {playlist.description && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                          {playlist.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recently Played - Only show when authenticated */}
      {isAuthenticated && recentlyPlayed.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Recently Played</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyPlayed.map((item) => (
              <Link href={`/album/${item.track.album.id}`} key={item.track.id + item.played_at}>
                <Card className="overflow-hidden bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow theme-glow-hover">
                  <CardContent className="p-0">
                    <Image
                      src={item.track.album.images[0]?.url || placeholder}
                      alt={item.track.name}
                      width={150}
                      height={150}
                      className="w-full"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold truncate">{item.track.name}</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                        {item.track.artists.map((a: any) => a.name).join(", ")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MainContent

