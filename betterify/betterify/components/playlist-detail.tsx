"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getPlaylist } from "@/lib/spotify"
import { Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Track {
  id: string
  name: string
  artists: { id: string; name: string }[]
  album: { id: string; name: string; images: { url: string }[] }
  duration_ms: number
}

interface PlaylistData {
  id: string
  name: string
  description: string
  images: { url: string }[]
  tracks: { items: { track: Track }[] }
  followers: { total: number }
  owner: { display_name: string }
}

export function PlaylistDetail({ id }: { id: string }) {
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        setIsLoading(true)
        const data = await getPlaylist(id)
        setPlaylist(data)
      } catch (err) {
        setError("Failed to fetch playlist. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlaylist()
  }, [id])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-start space-x-6 mb-8">
          <Skeleton className="w-48 h-48" />
          <div className="space-y-3">
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

  if (error || !playlist) {
    return <div className="flex-1 p-8 text-red-500">{error || "Failed to load playlist"}</div>
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="bg-gradient-to-b from-neutral-200 to-transparent dark:from-neutral-800 p-8">
        <div className="flex items-start space-x-6 mb-8">
          <div className="w-48 h-48 relative shadow-lg">
            <Image
              src={playlist.images[0]?.url || "/placeholder.svg?height=300&width=300"}
              alt={playlist.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-sm uppercase font-medium mb-2">Playlist</p>
            <h1 className="text-4xl font-bold mb-4">{playlist.name}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-2">{playlist.description}</p>
            <p className="text-sm">
              <span className="font-medium">{playlist.owner.display_name}</span> •{" "}
              {playlist.followers.total.toLocaleString()} followers • {playlist.tracks.items.length} songs
            </p>
          </div>
        </div>

        <Button className="rounded-full px-8 bg-neutral-800 dark:bg-white text-white dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-neutral-200">
          <Play size={16} className="mr-2" fill="currentColor" /> Play
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-20rem-8rem)]">
        <div className="p-8 pt-0">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
                <th className="px-4 py-2 text-left w-12">#</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Album</th>
                <th className="px-4 py-2 text-right">
                  <Clock size={16} />
                </th>
              </tr>
            </thead>
            <tbody>
              {playlist.tracks.items.map(({ track }, index) => (
                <tr key={track.id} className="hover:bg-neutral-100 dark:hover:bg-neutral-800 group">
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 relative mr-3 flex-shrink-0">
                        <Image
                          src={track.album.images[0]?.url || "/placeholder.svg?height=40&width=40"}
                          alt={track.album.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{track.name}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {track.artists.map((a) => a.name).join(", ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{track.album.name}</td>
                  <td className="px-4 py-3 text-right text-neutral-500 dark:text-neutral-400">
                    {formatDuration(track.duration_ms)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  )
}

