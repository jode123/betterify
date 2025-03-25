"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Plus, Trash, Music, FileAudio } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface LocalMedia {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  audioUrl: string
  coverUrl?: string
  fileType: string
  fileSize: number
  dateAdded: number
}

// Memoized media item component for better performance
const MediaItem = memo(
  ({
    media,
    onPlay,
    onAddToQueue,
    onDelete,
  }: {
    media: LocalMedia
    onPlay: () => void
    onAddToQueue: () => void
    onDelete: () => void
  }) => {
    // Format file size
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return bytes + " B"
      else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
      else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    }

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center p-4">
            <div className="w-12 h-12 relative mr-4 flex-shrink-0 bg-neutral-200 dark:bg-neutral-700 rounded-md flex items-center justify-center">
              {media.coverUrl ? (
                <Image
                  src={media.coverUrl || "/placeholder.svg"}
                  alt={media.title}
                  fill
                  className="object-cover rounded-md"
                />
              ) : (
                <FileAudio className="h-6 w-6 text-neutral-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{media.title}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-500 dark:text-neutral-400">
                <span className="truncate">{media.artist}</span>
                <span className="hidden sm:inline mx-1">•</span>
                <span className="text-xs">
                  {formatFileSize(media.fileSize)} • {media.fileType.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost" onClick={onPlay} title="Play">
                <Play size={18} />
              </Button>
              <Button size="icon" variant="ghost" onClick={onAddToQueue} title="Add to queue">
                <Plus size={18} />
              </Button>
              <Button size="icon" variant="ghost" onClick={onDelete} title="Remove">
                <Trash size={18} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  },
)
MediaItem.displayName = "MediaItem"

export function LocalMediaContent() {
  const [localMedia, setLocalMedia] = useState<LocalMedia[]>([])
  const [selectedTab, setSelectedTab] = useState("all")
  const [sortBy, setSortBy] = useState<"dateAdded" | "title" | "artist">("dateAdded")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Load local media from localStorage on mount
  useEffect(() => {
    const savedMedia = localStorage.getItem("local_media")
    if (savedMedia) {
      try {
        setLocalMedia(JSON.parse(savedMedia))
      } catch (error) {
        console.error("Error parsing local media:", error)
      }
    }
  }, [])

  // Save local media to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("local_media", JSON.stringify(localMedia))
  }, [localMedia])

  // Handle file selection
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || files.length === 0) return

      // Process each selected file
      const newMediaItems: LocalMedia[] = []

      Array.from(files).forEach((file) => {
        if (file.type.startsWith("audio/")) {
          // Create object URL for the audio file
          const audioUrl = URL.createObjectURL(file)

          // Extract metadata from filename (assuming format: Artist - Title.mp3)
          let title = file.name
          let artist = "Unknown Artist"

          const match = file.name.match(/^(.+?)\s*-\s*(.+)\.\w+$/)
          if (match) {
            artist = match[1].trim()
            title = match[2].trim()
          } else {
            // Remove file extension for title
            title = file.name.replace(/\.\w+$/, "")
          }

          // Get file extension
          const fileType = file.name.split(".").pop()?.toLowerCase() || "mp3"

          // Create a new media item
          const newMedia: LocalMedia = {
            id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            artist,
            audioUrl,
            duration: 0, // Will be updated when metadata is loaded
            coverUrl: "/placeholder.svg?height=200&width=200", // Default cover
            fileType,
            fileSize: file.size,
            dateAdded: Date.now(),
          }

          newMediaItems.push(newMedia)
        }
      })

      if (newMediaItems.length > 0) {
        setLocalMedia((prev) => [...prev, ...newMediaItems])

        toast({
          title: `${newMediaItems.length} File${newMediaItems.length > 1 ? "s" : ""} Added`,
          description: "Your audio files have been added to your local media library.",
        })
      } else {
        toast({
          title: "No Audio Files",
          description: "No supported audio files were found in your selection.",
          variant: "destructive",
        })
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [toast],
  )

  // Handle play
  const handlePlay = useCallback((media: LocalMedia) => {
    // Dispatch custom event to play local media
    window.dispatchEvent(
      new CustomEvent("play-local", {
        detail: {
          title: media.title,
          artist: media.artist,
          audioUrl: media.audioUrl,
        },
      }),
    )
  }, [])

  // Handle add to queue
  const handleAddToQueue = useCallback(
    (media: LocalMedia) => {
      // Dispatch custom event to add local media to queue
      window.dispatchEvent(
        new CustomEvent("add-to-queue", {
          detail: {
            title: media.title,
            artist: media.artist,
            audioUrl: media.audioUrl,
            isLocal: true,
          },
        }),
      )

      toast({
        title: "Added to Queue",
        description: `"${media.title}" has been added to your queue.`,
      })
    },
    [toast],
  )

  // Handle delete
  const handleDelete = useCallback(
    (id: string) => {
      setLocalMedia((prev) => {
        const mediaToDelete = prev.find((item) => item.id === id)
        const filtered = prev.filter((item) => item.id !== id)

        // Revoke object URL to prevent memory leaks
        if (mediaToDelete?.audioUrl) {
          URL.revokeObjectURL(mediaToDelete.audioUrl)
        }

        return filtered
      })

      toast({
        title: "File Removed",
        description: "The file has been removed from your local media.",
      })
    },
    [toast],
  )

  // Sort media items
  const sortedMedia = [...localMedia].sort((a, b) => {
    let comparison = 0

    if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title)
    } else if (sortBy === "artist") {
      comparison = a.artist.localeCompare(b.artist)
    } else {
      comparison = a.dateAdded - b.dateAdded
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  // Filter media items based on selected tab
  const filteredMedia = selectedTab === "recent" ? sortedMedia.slice(0, 10) : sortedMedia

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
          <Plus size={16} />
          Add Local Files
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">Supported formats: MP3, WAV, FLAC, AAC, OGG</p>
      </div>

      {localMedia.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Music className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No local media</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Add local audio files to play them in the app.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="all">All Files</TabsTrigger>
                <TabsTrigger value="recent">Recently Added</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <select
                className="text-sm bg-transparent border rounded p-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="dateAdded">Date Added</option>
                <option value="title">Title</option>
                <option value="artist">Artist</option>
              </select>
              <Button variant="ghost" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-16rem)] mt-4">
            <div className="space-y-4">
              {filteredMedia.map((media) => (
                <MediaItem
                  key={media.id}
                  media={media}
                  onPlay={() => handlePlay(media)}
                  onAddToQueue={() => handleAddToQueue(media)}
                  onDelete={() => handleDelete(media.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  )
}

