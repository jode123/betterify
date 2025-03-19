"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, Clock, Heart, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getPlaylist, removeSongFromPlaylist, type Song, isLikedSong, toggleLikeSong } from "@/lib/playlist-manager"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function UserPlaylistDetail({ id }: { id: string }) {
  const [playlist, setPlaylist] = useState<ReturnType<typeof getPlaylist>>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load playlist
  useEffect(() => {
    setIsLoading(true)
    const loadedPlaylist = getPlaylist(id)
    setPlaylist(loadedPlaylist)
    setIsLoading(false)
  }, [id])

  // Handle playing a song
  const playSong = (song: Song) => {
    window.dispatchEvent(
      new CustomEvent("play-piped", {
        detail: {
          videoId: song.videoId,
          title: song.title,
          uploader: song.artist,
        },
      }),
    )
  }

  // Handle removing a song from the playlist
  const handleRemoveSong = (songId: string) => {
    if (!playlist) return

    const success = removeSongFromPlaylist(playlist.id, songId)

    if (success) {
      // Refresh playlist
      setPlaylist(getPlaylist(id))

      toast({
        title: "Song Removed",
        description: "The song has been removed from this playlist.",
      })
    }
  }

  // Handle liking a song
  const handleLikeSong = (song: Song) => {
    const isLiked = toggleLikeSong(song)

    toast({
      title: isLiked ? "Added to Liked Songs" : "Removed from Liked Songs",
      description: `"${song.title}" by ${song.artist} has been ${isLiked ? "added to" : "removed from"} your Liked Songs.`,
    })
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
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

  if (!playlist) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Playlist Not Found</h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            The playlist you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="bg-gradient-to-b from-neutral-200 to-transparent dark:from-neutral-800 p-8">
        <div className="flex flex-col md:flex-row items-start md:space-x-6 mb-8">
          <div className="w-48 h-48 relative shadow-lg mx-auto md:mx-0 mb-4 md:mb-0">
            {playlist.songs.length > 0 ? (
              <Image
                src={playlist.songs[0].thumbnailUrl || "/placeholder.svg?height=300&width=300"}
                alt={playlist.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center">
                <span className="text-neutral-500 dark:text-neutral-400">No songs</span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-end text-center md:text-left">
            <p className="text-sm uppercase font-medium mb-2">Playlist</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">{playlist.description}</p>
            )}
            <p className="text-sm">
              {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"} • Created{" "}
              {new Date(playlist.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Button
          className="rounded-full px-8 bg-neutral-800 dark:bg-white text-white dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-neutral-200"
          onClick={() => {
            if (playlist.songs.length > 0) {
              playSong(playlist.songs[0])
            }
          }}
          disabled={playlist.songs.length === 0}
        >
          <Play size={16} className="mr-2" fill="currentColor" /> Play
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-20rem-8rem)]">
        <div className="p-8 pt-4">
          {playlist.songs.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
              This playlist is empty. Add songs from the search page.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-2 text-left w-12">#</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Artist</th>
                  <th className="px-4 py-2 text-right">
                    <Clock size={16} />
                  </th>
                  <th className="px-4 py-2 text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {playlist.songs.map((song, index) => (
                  <tr
                    key={song.id}
                    className="hover:bg-neutral-100 dark:hover:bg-neutral-800 group cursor-pointer"
                    onClick={() => playSong(song)}
                  >
                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 relative mr-3 flex-shrink-0">
                          <Image
                            src={song.thumbnailUrl || "/placeholder.svg?height=40&width=40"}
                            alt={song.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="font-medium">{song.title}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{song.artist}</td>
                    <td className="px-4 py-3 text-right text-neutral-500 dark:text-neutral-400">
                      {formatDuration(song.duration)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLikeSong(song)
                          }}
                        >
                          <Heart size={16} className={isLikedSong(song.id) ? "fill-red-500 text-red-500" : ""} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleRemoveSong(song.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove from Playlist
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

