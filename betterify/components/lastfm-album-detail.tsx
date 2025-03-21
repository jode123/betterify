"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LastFmAlbumInfo {
  name: string
  artist: string
  url: string
  image: { "#text": string; size: string }[]
  listeners: string
  playcount: string
  tracks?: {
    track: Array<
      | {
          name: string
          url: string
          duration?: string
          "@attr"?: { rank: string }
        }
      | {
          name: string
          url: string
          duration?: string
          artist: {
            name: string
            url: string
          }
          "@attr"?: { rank: string }
        }
    >
  }
  wiki?: {
    published: string
    summary: string
    content: string
  }
  tags?: {
    tag: Array<{
      name: string
      url: string
    }>
  }
}

export function LastFmAlbumDetail({ artist, album }: { artist: string; album: string }) {
  const [albumInfo, setAlbumInfo] = useState<LastFmAlbumInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const placeholder = "/placeholder.svg?height=300&width=300"

  useEffect(() => {
    async function fetchAlbumData() {
      try {
        setIsLoading(true)
        const response = await fetch(
          `/api/lastfm/album?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch album data: ${response.status}`)
        }

        const data = await response.json()
        setAlbumInfo(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load album information. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlbumData()
  }, [artist, album])

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex flex-col md:flex-row items-start md:space-x-6 mb-8">
          <Skeleton className="w-48 h-48" />
          <div className="space-y-3 mt-4 md:mt-0">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
        </div>
      </div>
    )
  }

  if (error || !albumInfo) {
    return <div className="flex-1 p-8 text-red-500">{error || "Failed to load album information"}</div>
  }

  // Get the largest available image
  const albumImage =
    albumInfo.image.find((img) => img.size === "extralarge")?.["#text"] ||
    albumInfo.image.find((img) => img.size === "large")?.["#text"] ||
    placeholder

  // Format wiki by removing HTML tags and links
  const formattedWiki = albumInfo.wiki?.summary
    ? albumInfo.wiki.summary.replace(/<a\b[^>]*>(.*?)<\/a>/gi, "$1").replace(/<[^>]*>/g, "")
    : "No description available."

  // Get a shorter version for the collapsed view
  const shortWiki = formattedWiki.split(".").slice(0, 2).join(".") + "."

  // Format duration
  const formatDuration = (duration?: string) => {
    if (!duration) return "-"
    const seconds = Number.parseInt(duration)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Normalize tracks to handle both array and single object cases
  const normalizedTracks = albumInfo.tracks?.track
    ? Array.isArray(albumInfo.tracks.track)
      ? albumInfo.tracks.track
      : [albumInfo.tracks.track]
    : []

  return (
    <div className="flex-1 overflow-hidden">
      <div className="bg-gradient-to-b from-neutral-200 to-transparent dark:from-neutral-800 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-6 mb-8">
          <div className="w-48 h-48 relative shadow-lg mx-auto md:mx-0 mb-4 md:mb-0">
            <Image src={albumImage || "/placeholder.svg"} alt={albumInfo.name} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-end text-center md:text-left">
            <p className="text-sm uppercase font-medium mb-2">Album</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{albumInfo.name}</h1>
            <Link
              href={`/lastfm/artist/${encodeURIComponent(albumInfo.artist)}`}
              className="text-xl mb-4 hover:underline"
            >
              {albumInfo.artist}
            </Link>

            {albumInfo.wiki && (
              <div className="text-neutral-600 dark:text-neutral-400 mb-2">
                <p className={showFullDescription ? "" : "line-clamp-2"}>
                  {showFullDescription ? formattedWiki : shortWiki}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-1 h-8 px-2 text-xs"
                >
                  {showFullDescription ? "Show Less" : "More Info"}
                </Button>
              </div>
            )}

            <p className="text-sm">
              <span className="font-medium">{Number.parseInt(albumInfo.listeners).toLocaleString()}</span> listeners •{" "}
              <span className="font-medium">{Number.parseInt(albumInfo.playcount).toLocaleString()}</span> plays
            </p>
          </div>
        </div>

        <div className="flex justify-center md:justify-start">
          <Button
            className="rounded-full px-8 theme-bg text-white hover:bg-neutral-700 dark:hover:bg-neutral-200 theme-glow-hover"
            onClick={() => {
              if (normalizedTracks.length > 0) {
                // Play the first track
                const track = normalizedTracks[0]
                const trackName = track.name
                window.dispatchEvent(
                  new CustomEvent("play-track", {
                    detail: { artist: albumInfo.artist, track: trackName, album: albumInfo.name },
                  }),
                )
              }
            }}
          >
            <Play size={16} className="mr-2" fill="currentColor" /> Play
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-20rem-8rem)]">
        <div className="p-4 md:p-8 pt-4">
          <h2 className="text-xl font-bold mb-4">Tracks</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-2 text-left w-12">#</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-right">
                    <Clock size={16} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {normalizedTracks.map((track, index) => {
                  // Handle both track formats
                  const trackName = track.name
                  const trackDuration = track.duration
                  const trackArtist = "artist" in track ? track.artist.name : albumInfo.artist

                  return (
                    <tr
                      key={`${trackName}-${index}`}
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-800 group cursor-pointer theme-glow-hover"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("play-track", {
                            detail: { artist: trackArtist, track: trackName, album: albumInfo.name },
                          }),
                        )
                      }}
                    >
                      <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                        {track["@attr"]?.rank || index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{trackName}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-500 dark:text-neutral-400">
                        {formatDuration(trackDuration)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

