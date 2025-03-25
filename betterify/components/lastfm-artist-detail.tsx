"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, User, Music, Disc, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCopyrightWarning } from "@/components/copyright-warning-modal"

interface LastFmArtistInfo {
  name: string
  mbid?: string
  url: string
  image: { "#text": string; size: string }[]
  bio?: {
    summary: string
    content: string
  }
  stats?: {
    listeners: string
    playcount: string
  }
  similar?: {
    artist: {
      name: string
      url: string
      image: { "#text": string; size: string }[]
    }[]
  }
  tags?: {
    tag: {
      name: string
      url: string
    }[]
  }
}

interface LastFmTrack {
  name: string
  playcount: string
  listeners: string
  url: string
  artist: {
    name: string
    mbid?: string
    url: string
  }
  image: { "#text": string; size: string }[]
  "@attr"?: {
    rank: string
  }
}

interface LastFmAlbum {
  name: string
  playcount: string
  url: string
  artist: {
    name: string
    mbid?: string
    url: string
  }
  image: { "#text": string; size: string }[]
  "@attr"?: {
    rank: string
  }
}

export function LastFmArtistDetail({ name }: { name: string }) {
  const [artistInfo, setArtistInfo] = useState<LastFmArtistInfo | null>(null)
  const [topTracks, setTopTracks] = useState<LastFmTrack[]>([])
  const [topAlbums, setTopAlbums] = useState<LastFmAlbum[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFullBio, setShowFullBio] = useState(false)
  const { showCopyrightWarning } = useCopyrightWarning()

  const placeholder = "/placeholder.svg?height=300&width=300"

  useEffect(() => {
    async function fetchArtistData() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/lastfm/artist?name=${encodeURIComponent(name)}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch artist data: ${response.status}`)
        }

        const data = await response.json()

        setArtistInfo(data.artistInfo)
        setTopTracks(data.topTracks)
        setTopAlbums(data.topAlbums)
      } catch (err) {
        console.error(err)
        setError("Failed to load artist information. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtistData()
  }, [name])

  const handlePlayTrack = (artist: string, track: string) => {
    showCopyrightWarning(() => {
      window.dispatchEvent(
        new CustomEvent("play-track", {
          detail: { artist, track },
        }),
      )
    })
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-start space-x-6 mb-8">
          <Skeleton className="w-48 h-48 rounded-full" />
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

  if (error || !artistInfo) {
    return <div className="flex-1 p-8 text-red-500">{error || "Failed to load artist information"}</div>
  }

  // Get the largest available image
  const artistImage =
    artistInfo.image.find((img) => img.size === "extralarge")?.["#text"] ||
    artistInfo.image.find((img) => img.size === "large")?.["#text"] ||
    placeholder

  // Format bio by removing HTML tags and links
  const formattedBio = artistInfo.bio?.summary
    ? artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/gi, "$1").replace(/<[^>]*>/g, "")
    : "No biography available."

  // Get a shorter version for the collapsed view
  const shortBio = formattedBio.split(".").slice(0, 2).join(".") + "."

  return (
    <div className="flex-1 overflow-hidden">
      <div className="bg-gradient-to-b from-neutral-200 to-transparent dark:from-neutral-800 p-8">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-6 mb-8">
          <div className="w-32 h-32 md:w-48 md:h-48 relative shadow-lg rounded-full overflow-hidden mx-auto md:mx-0 mb-4 md:mb-0">
            <Image src={artistImage || "/placeholder.svg"} alt={artistInfo.name} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-end text-center md:text-left">
            <p className="text-sm uppercase font-medium mb-2">Artist</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{artistInfo.name}</h1>
            <div className="text-neutral-600 dark:text-neutral-400 mb-2">
              <p className={showFullBio ? "" : "line-clamp-2"}>{showFullBio ? formattedBio : shortBio}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullBio(!showFullBio)}
                className="mt-1 h-8 px-2 text-xs"
              >
                {showFullBio ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> More Info
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm">
              {artistInfo.stats && (
                <>
                  <span className="font-medium">{Number.parseInt(artistInfo.stats.listeners).toLocaleString()}</span>{" "}
                  listeners •{" "}
                  <span className="font-medium">{Number.parseInt(artistInfo.stats.playcount).toLocaleString()}</span>{" "}
                  plays
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-center md:justify-start">
          <Button
            className="rounded-full px-8 theme-bg text-white hover:bg-neutral-700 dark:hover:bg-neutral-200 theme-glow-hover"
            onClick={() => {
              if (topTracks.length > 0) {
                // Play the first track
                const track = topTracks[0]
                const artistName = track.artist.name
                const trackName = track.name
                handlePlayTrack(artistName, trackName)
              }
            }}
          >
            <Play size={16} className="mr-2" fill="currentColor" /> Play Top Tracks
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tracks" className="flex-1">
        <div className="px-8 border-b border-neutral-200 dark:border-neutral-700 overflow-x-auto">
          <TabsList className="bg-transparent">
            <TabsTrigger value="tracks" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Music className="mr-2 h-4 w-4" />
              Top Tracks
            </TabsTrigger>
            <TabsTrigger value="albums" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Disc className="mr-2 h-4 w-4" />
              Albums
            </TabsTrigger>
            <TabsTrigger value="similar" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <User className="mr-2 h-4 w-4" />
              Similar Artists
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="h-[calc(100vh-20rem-8rem)]">
          <TabsContent value="tracks" className="p-4 md:p-8 pt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
                    <th className="px-4 py-2 text-left w-12">#</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-right">Listeners</th>
                  </tr>
                </thead>
                <tbody>
                  {topTracks.length > 0 ? (
                    topTracks.map((track, index) => (
                      <tr
                        key={track.name}
                        className="hover:bg-neutral-100 dark:hover:bg-neutral-800 group cursor-pointer theme-glow-hover"
                        onClick={() => handlePlayTrack(track.artist.name, track.name)}
                      >
                        <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 relative mr-3 flex-shrink-0">
                              <Image
                                src={track.image.find((img) => img.size === "medium")?.["#text"] || placeholder}
                                alt={track.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="font-medium">{track.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-neutral-500 dark:text-neutral-400">
                          {Number.parseInt(track.listeners).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-center text-neutral-500">
                        No tracks found for this artist
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="albums" className="p-4 md:p-8 pt-4">
            {topAlbums.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {topAlbums.map((album) => (
                  <Link
                    href={`/lastfm/album/${encodeURIComponent(album.artist.name)}/${encodeURIComponent(album.name)}`}
                    key={album.name}
                  >
                    <Card className="overflow-hidden bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow theme-glow-hover">
                      <CardContent className="p-0">
                        <div className="aspect-square relative">
                          <Image
                            src={album.image.find((img) => img.size === "extralarge")?.["#text"] || placeholder}
                            alt={album.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold truncate">{album.name}</h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {Number.parseInt(album.playcount).toLocaleString()} plays
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">No albums found for this artist</div>
            )}
          </TabsContent>

          <TabsContent value="similar" className="p-4 md:p-8 pt-4">
            {artistInfo.similar?.artist && artistInfo.similar.artist.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {artistInfo.similar?.artist.map((artist) => (
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
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">No similar artists found</div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

