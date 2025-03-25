"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { searchSpotify } from "@/lib/spotify"
import { searchPiped } from "@/lib/piped"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Search, Play, Heart, MoreHorizontal, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { addSongToPlaylist, toggleLikeSong, isLikedSong, type Song } from "@/lib/playlist-manager"
import { useToast } from "@/hooks/use-toast"
import { usePlaylists } from "@/hooks/use-playlists"
import { CopyrightWarningModal } from "@/components/copyright-warning-modal"

interface Track {
  id: string
  name: string
  artists: { id: string; name: string }[]
  album: { id: string; name: string; images: { url: string }[] }
}

interface Artist {
  id: string
  name: string
  images: { url: string }[]
}

interface Album {
  id: string
  name: string
  artists: { id: string; name: string }[]
  images: { url: string }[]
}

interface PipedResult {
  title: string
  url: string
  thumbnail: string
  uploaderName: string
  uploaderUrl: string
  uploaderAvatar: string
  duration: number
  views: number
  uploaded: string
  isShort: boolean
}

// Memoized track item component for better performance
const TrackItem = memo(
  ({
    track,
    onPlay,
    onLike,
    onAddToPlaylist,
    onDownload,
  }: {
    track: Track
    onPlay: () => void
    onLike: () => void
    onAddToPlaylist: () => void
    onDownload: () => void
  }) => {
    return (
      <div className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md group">
        <div className="w-12 h-12 relative mr-3">
          <Image
            src={track.album.images[0]?.url || "/placeholder.svg?height=48&width=48"}
            alt={track.album.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onPlay}>
              <Play size={16} fill="currentColor" />
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-medium">{track.name}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            {track.artists.map((a) => a.name).join(", ")}
          </div>
        </div>
        <div className="flex space-x-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onLike}>
            <Heart
              size={16}
              className={isLikedSong(`${track.artists[0].name}-${track.name}`) ? "fill-red-500 text-red-500" : ""}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onPlay}>Play</DropdownMenuItem>
              <DropdownMenuItem onClick={onDownload}>Download</DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    onAddToPlaylist()
                  }}
                >
                  Add to Playlist
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  },
)
TrackItem.displayName = "TrackItem"

// Memoized video item component for better performance
const VideoItem = memo(
  ({
    result,
    onPlay,
    onDownload,
  }: {
    result: PipedResult
    onPlay: () => void
    onDownload: () => void
  }) => {
    return (
      <div className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md group">
        <div className="w-12 h-12 relative mr-3">
          <Image
            src={result.thumbnail || "/placeholder.svg?height=48&width=48"}
            alt={result.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onPlay}>
              <Play size={16} fill="currentColor" />
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-medium">{result.title}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">{result.uploaderName}</div>
        </div>
        <div className="flex space-x-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onDownload}>
            <Download size={16} />
          </Button>
        </div>
      </div>
    )
  },
)
VideoItem.displayName = "VideoItem"

export function SearchContent() {
  const [query, setQuery] = useState("")
  const [spotifyResults, setSpotifyResults] = useState<{
    tracks: Track[]
    artists: Artist[]
    albums: Album[]
  }>({ tracks: [], artists: [], albums: [] })
  const [pipedResults, setPipedResults] = useState<PipedResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false)
  const [showCopyrightWarning, setShowCopyrightWarning] = useState(false)
  const [downloadInfo, setDownloadInfo] = useState<{ videoId: string; title: string; artist: string } | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const { playlists } = usePlaylists()

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSpotifyResults({ tracks: [], artists: [], albums: [] })
      setPipedResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Run searches in parallel for better performance
      const [spotifyData, pipedData] = await Promise.all([searchSpotify(searchQuery), searchPiped(searchQuery)])

      setSpotifyResults({
        tracks: spotifyData.tracks?.items || [],
        artists: spotifyData.artists?.items || [],
        albums: spotifyData.albums?.items || [],
      })
      setPipedResults(pipedData)
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to search. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle search input with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query)
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query, performSearch])

  // Handle playing a track
  const playTrack = useCallback(
    (artist: string, track: string, album?: string) => {
      try {
        window.dispatchEvent(
          new CustomEvent("play-track", {
            detail: { artist, track, album },
          }),
        )
      } catch (error) {
        console.error("Error playing track:", error)
        toast({
          title: "Playback Error",
          description: "Failed to play this track. Please try another one.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  // Handle playing a Piped result
  const playPipedResult = useCallback((result: PipedResult) => {
    const videoId = result.url.split("v=")[1] || result.url.split("/").pop()

    window.dispatchEvent(
      new CustomEvent("play-piped", {
        detail: { videoId, title: result.title, uploader: result.uploaderName },
      }),
    )
  }, [])

  // Handle downloading a track
  const handleDownload = useCallback((videoId: string, title: string, artist: string) => {
    setDownloadInfo({ videoId, title, artist })
    setShowCopyrightWarning(true)
  }, [])

  // Proceed with download after copyright warning
  const proceedWithDownload = useCallback(async () => {
    if (!downloadInfo) return

    try {
      const { videoId, title, artist } = downloadInfo

      toast({
        title: "Download Started",
        description: "Your download has started. This may take a moment.",
      })

      const response = await fetch(
        `/api/download?videoId=${videoId}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&audioOnly=true`,
      )

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Download Complete",
          description: "Your download has completed successfully.",
        })

        // Create a temporary link to download the file
        const link = document.createElement("a")
        link.href = data.downloadUrl
        link.download = data.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        throw new Error(data.error || "Download failed")
      }
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Error",
        description: "Failed to download this track. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowCopyrightWarning(false)
      setDownloadInfo(null)
    }
  }, [downloadInfo, toast])

  // Handle liking a song
  const handleLikeSong = useCallback(
    async (artist: string, track: string, thumbnailUrl: string) => {
      try {
        // Get video ID from Piped
        const searchResults = await searchPiped(`${artist} ${track}`)

        if (searchResults.length === 0) {
          throw new Error("No results found")
        }

        const videoId = searchResults[0].url.split("v=")[1] || searchResults[0].url.split("/").pop()

        const song: Song = {
          id: `song_${Date.now()}`,
          title: track,
          artist: artist,
          thumbnailUrl,
          videoId,
          duration: searchResults[0].duration || 0,
        }

        const isLiked = toggleLikeSong(song)

        toast({
          title: isLiked ? "Added to Liked Songs" : "Removed from Liked Songs",
          description: `"${track}" by ${artist} has been ${isLiked ? "added to" : "removed from"} your Liked Songs.`,
        })
      } catch (error) {
        console.error("Error liking song:", error)
        toast({
          title: "Error",
          description: "Failed to like this song. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  // Handle adding a song to a playlist
  const handleAddToPlaylist = useCallback(
    async (playlistId: string) => {
      if (!selectedSong) return

      setIsAddingToPlaylist(true)

      try {
        const success = addSongToPlaylist(playlistId, selectedSong)

        if (success) {
          toast({
            title: "Added to Playlist",
            description: `"${selectedSong.title}" has been added to the playlist.`,
          })
        } else {
          toast({
            title: "Already in Playlist",
            description: "This song is already in the selected playlist.",
          })
        }
      } catch (error) {
        console.error("Error adding to playlist:", error)
        toast({
          title: "Error",
          description: "Failed to add song to playlist. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsAddingToPlaylist(false)
        setSelectedSong(null)
      }
    },
    [selectedSong, toast],
  )

  // Prepare a song for adding to playlist
  const prepareAddToPlaylist = useCallback(
    async (artist: string, track: string, thumbnailUrl: string) => {
      try {
        // Get video ID from Piped
        const searchResults = await searchPiped(`${artist} ${track}`)

        if (searchResults.length === 0) {
          throw new Error("No results found")
        }

        const videoId = searchResults[0].url.split("v=")[1] || searchResults[0].url.split("/").pop()

        setSelectedSong({
          id: `song_${Date.now()}`,
          title: track,
          artist: artist,
          thumbnailUrl,
          videoId,
          duration: searchResults[0].duration || 0,
        })
      } catch (error) {
        console.error("Error preparing song:", error)
        toast({
          title: "Error",
          description: "Failed to prepare song for playlist. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  // Prepare download for a Spotify track
  const prepareSpotifyDownload = useCallback(
    async (artist: string, track: string) => {
      try {
        // Get video ID from Piped
        const searchResults = await searchPiped(`${artist} ${track}`)
        if (searchResults.length > 0) {
          const videoId = searchResults[0].url.split("v=")[1] || searchResults[0].url.split("/").pop()
          handleDownload(videoId, track, artist)
        } else {
          toast({
            title: "Download Error",
            description: "Could not find a matching video for this track.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error preparing download:", error)
        toast({
          title: "Error",
          description: "Failed to prepare download. Please try again.",
          variant: "destructive",
        })
      }
    },
    [handleDownload, toast],
  )

  return (
    <div className="flex-1 p-4 md:p-8 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Search</h2>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
        <Input
          className="pl-10 bg-neutral-100 dark:bg-neutral-800 border-none"
          placeholder="Search for songs, artists, or albums..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query.trim() ? (
        <Tabs defaultValue="all" className="h-[calc(100vh-12rem-8rem)]">
          <TabsList className="mb-6 overflow-x-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="songs">Songs</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-full">
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="text-center py-8">Searching...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <div className="space-y-8">
                  {/* Spotify Tracks */}
                  {spotifyResults.tracks.length > 0 && (
                    <section>
                      <h3 className="text-xl font-semibold mb-4">Songs</h3>
                      <div className="space-y-2">
                        {spotifyResults.tracks.slice(0, 5).map((track) => (
                          <TrackItem
                            key={track.id}
                            track={track}
                            onPlay={() => playTrack(track.artists[0].name, track.name, track.album.name)}
                            onLike={() =>
                              handleLikeSong(
                                track.artists[0].name,
                                track.name,
                                track.album.images[0]?.url || "/placeholder.svg?height=48&width=48",
                              )
                            }
                            onAddToPlaylist={() =>
                              prepareAddToPlaylist(
                                track.artists[0].name,
                                track.name,
                                track.album.images[0]?.url || "/placeholder.svg?height=48&width=48",
                              )
                            }
                            onDownload={() => prepareSpotifyDownload(track.artists[0].name, track.name)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Piped Results */}
                  {pipedResults.length > 0 && (
                    <section>
                      <h3 className="text-xl font-semibold mb-4">Videos</h3>
                      <div className="space-y-2">
                        {pipedResults.slice(0, 5).map((result) => (
                          <VideoItem
                            key={result.url}
                            result={result}
                            onPlay={() => playPipedResult(result)}
                            onDownload={() => {
                              const videoId = result.url.split("v=")[1] || result.url.split("/").pop()
                              handleDownload(videoId, result.title, result.uploaderName)
                            }}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Spotify Artists */}
                  {spotifyResults.artists.length > 0 && (
                    <section>
                      <h3 className="text-xl font-semibold mb-4">Artists</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {spotifyResults.artists.map((artist) => (
                          <Link href={`/artist/${artist.id}`} key={artist.id}>
                            <Card className="overflow-hidden hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                              <CardContent className="p-4 flex flex-col items-center text-center">
                                <div className="w-32 h-32 relative rounded-full overflow-hidden mb-3">
                                  <Image
                                    src={artist.images[0]?.url || "/placeholder.svg?height=128&width=128"}
                                    alt={artist.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="font-medium truncate w-full">{artist.name}</div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">Artist</div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Spotify Albums */}
                  {spotifyResults.albums.length > 0 && (
                    <section>
                      <h3 className="text-xl font-semibold mb-4">Albums</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {spotifyResults.albums.map((album) => (
                          <Card
                            key={album.id}
                            className="overflow-hidden hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <CardContent className="p-0">
                              <div className="aspect-square relative">
                                <Image
                                  src={album.images[0]?.url || "/placeholder.svg?height=200&width=200"}
                                  alt={album.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="font-medium truncate">{album.name}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                                  {album.artists.map((a) => a.name).join(", ")}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </section>
                  )}

                  {spotifyResults.tracks.length === 0 &&
                    spotifyResults.artists.length === 0 &&
                    spotifyResults.albums.length === 0 &&
                    pipedResults.length === 0 && <div className="text-center py-8">No results found for "{query}"</div>}
                </div>
              )}
            </TabsContent>

            {/* Other tabs content similar to above */}
            <TabsContent value="songs" className="mt-0">
              {/* Songs tab content */}
              {isLoading ? (
                <div className="text-center py-8">Searching...</div>
              ) : spotifyResults.tracks.length > 0 ? (
                <div className="space-y-2">
                  {spotifyResults.tracks.map((track) => (
                    <TrackItem
                      key={track.id}
                      track={track}
                      onPlay={() => playTrack(track.artists[0].name, track.name, track.album.name)}
                      onLike={() =>
                        handleLikeSong(
                          track.artists[0].name,
                          track.name,
                          track.album.images[0]?.url || "/placeholder.svg?height=48&width=48",
                        )
                      }
                      onAddToPlaylist={() =>
                        prepareAddToPlaylist(
                          track.artists[0].name,
                          track.name,
                          track.album.images[0]?.url || "/placeholder.svg?height=48&width=48",
                        )
                      }
                      onDownload={() => prepareSpotifyDownload(track.artists[0].name, track.name)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">No songs found for "{query}"</div>
              )}
            </TabsContent>

            <TabsContent value="artists" className="mt-0">
              {/* Artists tab content */}
              {isLoading ? (
                <div className="text-center py-8">Searching...</div>
              ) : spotifyResults.artists.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {spotifyResults.artists.map((artist) => (
                    <Link href={`/artist/${artist.id}`} key={artist.id}>
                      <Card className="overflow-hidden hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="w-32 h-32 relative rounded-full overflow-hidden mb-3">
                            <Image
                              src={artist.images[0]?.url || "/placeholder.svg?height=128&width=128"}
                              alt={artist.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="font-medium truncate w-full">{artist.name}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">Artist</div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">No artists found for "{query}"</div>
              )}
            </TabsContent>

            <TabsContent value="albums" className="mt-0">
              {/* Albums tab content */}
              {isLoading ? (
                <div className="text-center py-8">Searching...</div>
              ) : spotifyResults.albums.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {spotifyResults.albums.map((album) => (
                    <Card
                      key={album.id}
                      className="overflow-hidden hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <CardContent className="p-0">
                        <div className="aspect-square relative">
                          <Image
                            src={album.images[0]?.url || "/placeholder.svg?height=200&width=200"}
                            alt={album.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium truncate">{album.name}</h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                            {album.artists.map((a) => a.name).join(", ")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">No albums found for "{query}"</div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
              {/* Videos tab content */}
              {isLoading ? (
                <div className="text-center py-8">Searching...</div>
              ) : pipedResults.length > 0 ? (
                <div className="space-y-4">
                  {pipedResults.map((result) => (
                    <div
                      key={result.url}
                      className="flex flex-col md:flex-row items-start p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                    >
                      <div className="w-full md:w-48 h-28 relative mb-3 md:mb-0 md:mr-4 flex-shrink-0">
                        <Image
                          src={result.thumbnail || "/placeholder.svg?height=112&width=192"}
                          alt={result.title}
                          fill
                          className="object-cover rounded-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-10 w-10 rounded-full bg-black/70 text-white hover:bg-black/90"
                            onClick={() => playPipedResult(result)}
                          >
                            <Play size={20} fill="currentColor" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1 line-clamp-2">{result.title}</h4>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">{result.uploaderName}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {result.views.toLocaleString()} views • {result.uploaded}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 md:mt-0 md:ml-2"
                        onClick={() => {
                          const videoId = result.url.split("v=")[1] || result.url.split("/").pop()
                          handleDownload(videoId, result.title, result.uploaderName)
                        }}
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">No videos found for "{query}"</div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      ) : (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          Search for artists, songs, albums, or videos
        </div>
      )}

      {/* Copyright Warning Modal */}
      <CopyrightWarningModal
        isOpen={showCopyrightWarning}
        onClose={() => setShowCopyrightWarning(false)}
        onProceed={proceedWithDownload}
      />

      {/* Add to Playlist Dialog */}
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
            <DialogDescription>Select a playlist to add this song to.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {playlists.length === 0 ? (
              <p className="text-center text-neutral-500">No playlists found. Create one first.</p>
            ) : (
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <Button
                    key={playlist.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    disabled={isAddingToPlaylist}
                  >
                    {playlist.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

