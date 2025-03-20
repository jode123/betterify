"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { searchSpotify } from "@/lib/spotify"
import { searchPiped } from "@/lib/piped"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Search, Play, Heart, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getPlaylists, addSongToPlaylist, toggleLikeSong, isLikedSong, type Song } from "@/lib/playlist-manager"
import { useToast } from "@/hooks/use-toast"

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
  const [playlists, setPlaylists] = useState<ReturnType<typeof getPlaylists>>([])
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Load playlists
  useEffect(() => {
    setPlaylists(getPlaylists())
  }, [])

  // Search function
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!query.trim()) {
      setSpotifyResults({ tracks: [], artists: [], albums: [] })
      setPipedResults([])
      return
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Search on Spotify
        const spotifyData = await searchSpotify(query)
        setSpotifyResults({
          tracks: spotifyData.tracks?.items || [],
          artists: spotifyData.artists?.items || [],
          albums: spotifyData.albums?.items || [],
        })

        // Search on Piped
        const pipedData = await searchPiped(query)
        setPipedResults(pipedData)
      } catch (err) {
        console.error("Search error:", err)
        setError("Failed to search. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query])

  // Handle playing a track
  const playTrack = async (artist: string, track: string, album?: string) => {
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
  }

  // Handle playing a Piped result
  const playPipedResult = (result: PipedResult) => {
    const videoId = result.url.split("v=")[1] || result.url.split("/").pop()

    window.dispatchEvent(
      new CustomEvent("play-piped", {
        detail: { videoId, title: result.title, uploader: result.uploaderName },
      }),
    )
  }

  // Handle liking a song
  const handleLikeSong = async (artist: string, track: string, thumbnailUrl: string) => {
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

      // Refresh playlists
      setPlaylists(getPlaylists())
    } catch (error) {
      console.error("Error liking song:", error)
      toast({
        title: "Error",
        description: "Failed to like this song. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle adding a song to a playlist
  const handleAddToPlaylist = async (playlistId: string) => {
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

      // Refresh playlists
      setPlaylists(getPlaylists())
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
  }

  // Prepare a song for adding to playlist
  const prepareAddToPlaylist = async (artist: string, track: string, thumbnailUrl: string) => {
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
  }

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
                          <div
                            key={track.id}
                            className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md group"
                          >
                            <div className="w-12 h-12 relative mr-3">
                              <Image
                                src={track.album.images[0]?.url || "/placeholder.svg?height=48&width=48"}
                                alt={track.album.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-white"
                                  onClick={() => playTrack(track.artists[0].name, track.name, track.album.name)}
                                >
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
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleLikeSong(
                                    track.artists[0].name,
                                    track.name,
                                    track.album.images[0]?.url || "/placeholder.svg?height=48&width=48",
                                  )
                                }
                              >
                                <Heart
                                  size={16}
                                  className={
                                    isLikedSong(`${track.artists[0].name}-${track.name}`)
                                      ? "fill-red-500 text-red-500"
                                      : ""
                                  }
                                />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <MoreHorizontal size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => playTrack(track.artists[0].name, track.name, track.album.name)}
                                  >
                                    Play
                                  </DropdownMenuItem>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => {
                                          e.preventDefault()
                                          prepareAddToPlaylist(
                                            track.artists[0].name,
                                            track.name,
                                            track.album.images[0]?.url || "/placeholder.svg?height=48&width=48",
                                          )
                                        }}
                                      >
                                        Add to Playlist
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Add to Playlist</DialogTitle>
                                        <DialogDescription>Select a playlist to add this song to.</DialogDescription>
                                      </DialogHeader>
                                      <div className="py-4">
                                        {playlists.length === 0 ? (
                                          <p className="text-center text-neutral-500">
                                            No playlists found. Create one first.
                                          </p>
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
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
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
                          <div
                            key={result.url}
                            className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md group"
                          >
                            <div className="w-12 h-12 relative mr-3">
                              <Image
                                src={result.thumbnail || "/placeholder.svg?height=48&width=48"}
                                alt={result.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-white"
                                  onClick={() => playPipedResult(result)}
                                >
                                  <Play size={16} fill="currentColor" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{result.title}</div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                {result.uploaderName}
                              </div>
                            </div>
                          </div>
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

            <TabsContent value="songs" className="mt-0">
              {isLoading ? (
                <div className="text-center py-8">Searching...</div>
              ) : spotifyResults.tracks.length > 0 ? (
                <div className="space-y-2">
                  {spotifyResults.tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md group"
                    >
                      <div className="w-12 h-12 relative mr-3">
                        <Image
                          src={track.album.images[0]?.url || "/placeholder.svg?height=48&width=48"}
                          alt={track.album.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white"
                            onClick={() => playTrack(track.artists[0].name, track.name, track.album.name)}
                          >
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
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">{track.album.name}</div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() =>
                            handleLikeSong(
                              track.artists[0].name,
                              track.name,
                              track.album.images[0]?.url || "/placeholder.svg?height=48&width=48",
                            )
                          }
                        >
                          <Heart
                            size={16}
                            className={
                              isLikedSong(`${track.artists[0].name}-${track.name}`) ? "fill-red-500 text-red-500" : ""
                            }
                          />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => playTrack(track.artists[0].name, track.name, track.album.name)}
                            >
                              Play
                            </DropdownMenuItem>
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    prepareAddToPlaylist(
                                      track.artists[0].name,
                                      track.name,
                                      track.album.images[0]?.url || "/placeholder.svg?height=48&width=48",
                                    )
                                  }}
                                >
                                  Add to Playlist
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add to Playlist</DialogTitle>
                                  <DialogDescription>Select a playlist to add this song to.</DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  {playlists.length === 0 ? (
                                    <p className="text-center text-neutral-500">
                                      No playlists found. Create one first.
                                    </p>
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">No songs found for "{query}"</div>
              )}
            </TabsContent>

            <TabsContent value="artists" className="mt-0">
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
    </div>
  )
}

