"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Minimize2, Heart } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTheme } from "@/lib/theme-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { getStreamUrl } from "@/lib/piped"
import { toggleLikeSong, isLikedSong } from "@/lib/playlist-manager"
import { useToast } from "@/hooks/use-toast"
import { searchTrackOnPiped, ensureProperStreamUrl } from "@/lib/piped"
import { useAppSettings } from "@/hooks/use-app-settings"

interface PlayerState {
  isPlaying: boolean
  currentTrack: {
    title: string
    artist: string
    album?: string
    thumbnailUrl: string
    audioUrl: string
    videoUrl?: string
    videoId?: string
    duration: number
    isLocal?: boolean
  } | null
  volume: number
  currentTime: number
  isFullscreen: boolean
  isMuted: boolean
  queue: Array<{
    title: string
    artist: string
    album?: string
    videoId?: string
    audioUrl?: string
    isLocal?: boolean
  }>
  history: Array<{
    title: string
    artist: string
    album?: string
    videoId?: string
    audioUrl?: string
    isLocal?: boolean
  }>
}

export function Player() {
  // Check if we're in a browser environment before using hooks that depend on it
  const isBrowser = typeof window !== "undefined"
  const { isDarkMode, themeColor } = useTheme()
  const isMobile = isBrowser ? useIsMobile() : false

  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTrack: null,
    volume: 80,
    currentTime: 0,
    isFullscreen: false,
    isMuted: false,
    queue: [],
    history: [],
  })

  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { settings } = useAppSettings()

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Handle play/pause
  const togglePlayback = () => {
    if (!playerState.currentTrack) return

    if (playerState.isPlaying) {
      audioRef.current?.pause()
      videoRef.current?.pause()
    } else {
      audioRef.current?.play()
      videoRef.current?.play()
    }

    setPlayerState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setPlayerState((prev) => ({ ...prev, volume: newVolume, isMuted: newVolume === 0 }))

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    const newMuted = !playerState.isMuted
    const newVolume = newMuted ? 0 : playerState.volume || 80

    setPlayerState((prev) => ({
      ...prev,
      isMuted: newMuted,
      volume: newMuted ? 0 : prev.volume || 80,
    }))

    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : newVolume / 100
    }
    if (videoRef.current) {
      videoRef.current.volume = newMuted ? 0 : newVolume / 100
    }
  }

  // Handle seeking
  const handleSeek = (value: number[]) => {
    const newTime = value[0]
    setPlayerState((prev) => ({ ...prev, currentTime: newTime }))

    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!playerState.currentTrack || !settings.videoEnabled) return

    if (playerState.isFullscreen) {
      document.exitFullscreen()
    } else if (playerRef.current) {
      playerRef.current.requestFullscreen()
    }
  }

  // Handle liking the current track
  const handleLikeCurrentTrack = () => {
    if (!playerState.currentTrack || playerState.currentTrack.isLocal) return

    const { title, artist, thumbnailUrl, videoId, duration } = playerState.currentTrack

    const song = {
      id: `song_${Date.now()}`,
      title,
      artist,
      thumbnailUrl,
      videoId: videoId || "",
      duration,
    }

    const isLiked = toggleLikeSong(song)

    toast({
      title: isLiked ? "Added to Liked Songs" : "Removed from Liked Songs",
      description: `"${title}" by ${artist} has been ${isLiked ? "added to" : "removed from"} your Liked Songs.`,
    })
  }

  // Skip to next track in queue
  const skipToNext = () => {
    if (playerState.queue.length === 0) return

    const nextTrack = playerState.queue[0]
    const newQueue = playerState.queue.slice(1)

    // Add current track to history if it exists
    const newHistory = playerState.currentTrack
      ? [
          ...playerState.history,
          {
            title: playerState.currentTrack.title,
            artist: playerState.currentTrack.artist,
            album: playerState.currentTrack.album,
            videoId: playerState.currentTrack.videoId,
            audioUrl: playerState.currentTrack.audioUrl,
            isLocal: playerState.currentTrack.isLocal,
          },
        ]
      : playerState.history

    setPlayerState((prev) => ({
      ...prev,
      queue: newQueue,
      history: newHistory,
    }))

    // Play the next track
    if (nextTrack) {
      if (nextTrack.isLocal && nextTrack.audioUrl) {
        playLocalTrack(nextTrack.title, nextTrack.artist, nextTrack.audioUrl)
      } else {
        playTrack(nextTrack.artist, nextTrack.title, nextTrack.album, nextTrack.videoId)
      }
    }
  }

  // Skip to previous track in history
  const skipToPrevious = () => {
    if (playerState.history.length === 0) return

    // If current time is more than 3 seconds, restart the current track
    if (playerState.currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
      if (videoRef.current) {
        videoRef.current.currentTime = 0
      }
      return
    }

    const prevTrack = playerState.history[playerState.history.length - 1]
    const newHistory = playerState.history.slice(0, -1)

    // Add current track to queue if it exists
    const newQueue = playerState.currentTrack
      ? [
          {
            title: playerState.currentTrack.title,
            artist: playerState.currentTrack.artist,
            album: playerState.currentTrack.album,
            videoId: playerState.currentTrack.videoId,
            audioUrl: playerState.currentTrack.audioUrl,
            isLocal: playerState.currentTrack.isLocal,
          },
          ...playerState.queue,
        ]
      : playerState.queue

    setPlayerState((prev) => ({
      ...prev,
      queue: newQueue,
      history: newHistory,
    }))

    // Play the previous track
    if (prevTrack) {
      if (prevTrack.isLocal && prevTrack.audioUrl) {
        playLocalTrack(prevTrack.title, prevTrack.artist, prevTrack.audioUrl)
      } else {
        playTrack(prevTrack.artist, prevTrack.title, prevTrack.album, prevTrack.videoId)
      }
    }
  }

  // Play a local track
  const playLocalTrack = (title: string, artist: string, audioUrl: string) => {
    setPlayerState((prev) => ({
      ...prev,
      currentTrack: {
        title,
        artist,
        thumbnailUrl: "/placeholder.svg?height=300&width=300",
        audioUrl,
        duration: 0, // Will be updated when metadata loads
        isLocal: true,
      },
      isPlaying: true,
      currentTime: 0,
    }))

    // Play the track
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          toast({
            title: "Playback Error",
            description: "Failed to play audio. Please check your connection and try again.",
            variant: "destructive",
          })
        })
      }
    }, 100)
  }

  // Play a track with Piped
  const playTrack = async (artist: string, track: string, album?: string, videoId?: string) => {
    setIsSearching(true)
    setIsLoading(true)

    try {
      let streamData

      if (videoId) {
        // If we already have a video ID, use it directly
        streamData = await getStreamUrl(videoId)
      } else {
        // Otherwise search for the track
        streamData = await searchTrackOnPiped(artist, track, album)
      }

      if (!streamData || !streamData.audioUrl) {
        toast({
          title: "Playback Error",
          description: "Could not find audio for this track. Please try another one.",
          variant: "destructive",
        })
        throw new Error("Failed to get stream data or audio URL")
      }

      // Ensure audio and video URLs are properly formatted
      const audioUrl = ensureProperStreamUrl(streamData.audioUrl)
      const videoUrl = streamData.videoUrl ? ensureProperStreamUrl(streamData.videoUrl) : undefined

      // Set the current track
      setPlayerState((prev) => ({
        ...prev,
        currentTrack: {
          title: track,
          artist: artist,
          album: album,
          thumbnailUrl: streamData.thumbnailUrl,
          audioUrl: audioUrl,
          videoUrl: videoUrl,
          videoId: videoId || streamData.videoId,
          duration: streamData.duration,
          isLocal: false,
        },
        isPlaying: true,
        currentTime: 0,
      }))

      // Play the track
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.error("Error playing audio:", error)
            toast({
              title: "Playback Error",
              description: "Failed to play audio. Please check your connection and try again.",
              variant: "destructive",
            })
          })
        }
      }, 100)
    } catch (error) {
      console.error("Error playing track:", error)
      toast({
        title: "Playback Error",
        description: "Failed to play this track. Please try another one.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
      setIsLoading(false)
    }
  }

  // Listen for timeupdate events
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setPlayerState((prev) => ({
          ...prev,
          currentTime: audioRef.current?.currentTime || 0,
          currentTrack: prev.currentTrack && {
            ...prev.currentTrack,
            duration: audioRef.current?.duration || prev.currentTrack.duration,
          },
        }))
      }
    }

    const handleEnded = () => {
      // When track ends, play the next one in queue if available
      if (playerState.queue.length > 0) {
        skipToNext()
      } else {
        setPlayerState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }))
      }
    }

    audioRef.current?.addEventListener("timeupdate", handleTimeUpdate)
    audioRef.current?.addEventListener("ended", handleEnded)

    return () => {
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate)
      audioRef.current?.removeEventListener("ended", handleEnded)
    }
  }, [playerState.queue])

  // Listen for fullscreenchange events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setPlayerState((prev) => ({
        ...prev,
        isFullscreen: document.fullscreenElement !== null,
      }))
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Listen for play-track custom events
  useEffect(() => {
    const handlePlayTrack = async (event: Event) => {
      const { artist, track, album } = (event as CustomEvent).detail

      if (!artist || !track) return

      playTrack(artist, track, album)
    }

    // Listen for play-piped custom events (direct video ID)
    const handlePlayPiped = async (event: Event) => {
      const { videoId, title, uploader } = (event as CustomEvent).detail

      if (!videoId) return

      playTrack(uploader, title, undefined, videoId)
    }

    // Listen for play-local custom events
    const handlePlayLocal = async (event: Event) => {
      const { title, artist, audioUrl } = (event as CustomEvent).detail

      if (!audioUrl) return

      playLocalTrack(title, artist, audioUrl)
    }

    // Listen for add-to-queue custom events
    const handleAddToQueue = (event: Event) => {
      const { artist, track, album, videoId, audioUrl, isLocal } = (event as CustomEvent).detail

      if (!artist || !track) return

      setPlayerState((prev) => ({
        ...prev,
        queue: [...prev.queue, { artist, title: track, album, videoId, audioUrl, isLocal }],
      }))

      toast({
        title: "Added to Queue",
        description: `"${track}" by ${artist} has been added to your queue.`,
      })
    }

    window.addEventListener("play-track", handlePlayTrack)
    window.addEventListener("play-piped", handlePlayPiped)
    window.addEventListener("play-local", handlePlayLocal)
    window.addEventListener("add-to-queue", handleAddToQueue)

    return () => {
      window.removeEventListener("play-track", handlePlayTrack)
      window.removeEventListener("play-piped", handlePlayPiped)
      window.removeEventListener("play-local", handlePlayLocal)
      window.removeEventListener("add-to-queue", handleAddToQueue)
    }
  }, [toast])

  // Get theme-based styles
  const getThemeStyles = () => {
    if (isDarkMode) {
      return {
        bg: "bg-neutral-800",
        text: "text-white",
        border: "border-neutral-700",
      }
    } else {
      return {
        bg: "bg-neutral-100",
        text: "text-neutral-900",
        border: "border-neutral-200",
      }
    }
  }

  const themeStyles = getThemeStyles()

  return (
    <div
      ref={playerRef}
      className={cn(
        "h-20 border-t flex items-center px-4 transition-colors",
        themeStyles.bg,
        themeStyles.border,
        playerState.isFullscreen && "h-screen flex-col justify-center items-center p-8",
      )}
    >
      {playerState.isFullscreen && playerState.currentTrack?.videoUrl && settings.videoEnabled && (
        <div className="w-full max-w-4xl aspect-video mb-8 relative">
          <video
            ref={videoRef}
            src={playerState.currentTrack.videoUrl}
            className="w-full h-full"
            autoPlay={playerState.isPlaying}
            muted={playerState.isMuted}
            controls={false}
          />
        </div>
      )}

      <div
        className={cn(
          "w-1/3",
          isMobile && "w-1/2",
          playerState.isFullscreen && "w-full max-w-4xl flex justify-start mb-4",
        )}
      >
        {playerState.currentTrack ? (
          <div className="flex items-center">
            <div
              className={cn(
                "w-12 h-12 mr-4 relative flex-shrink-0 rounded overflow-hidden theme-glow-hover",
                playerState.isFullscreen && "w-16 h-16",
              )}
            >
              <Image
                src={playerState.currentTrack.thumbnailUrl || "/placeholder.svg?height=50&width=50"}
                alt="Album cover"
                fill
                className="object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <div className={cn("font-semibold truncate", themeStyles.text)}>{playerState.currentTrack.title}</div>
              <div className={cn("text-sm truncate", themeStyles.text, "opacity-70")}>
                {playerState.currentTrack.artist}
              </div>
            </div>
            {!playerState.currentTrack.isLocal && (
              <Button
                size="icon"
                variant="ghost"
                className="ml-2 h-8 w-8 theme-glow-hover"
                onClick={handleLikeCurrentTrack}
              >
                <Heart
                  size={16}
                  className={
                    playerState.currentTrack.videoId && isLikedSong(playerState.currentTrack.videoId)
                      ? "fill-red-500 text-red-500"
                      : ""
                  }
                />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-12 h-12 mr-4 bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 rounded" />
            <div>
              <div className={cn("font-semibold", themeStyles.text)}>
                {isSearching ? "Searching..." : "Not Playing"}
              </div>
              <div className={cn("text-sm", themeStyles.text, "opacity-70")}>
                {isSearching ? "Please wait" : "Select a track to play"}
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "w-1/3 flex flex-col justify-center items-center space-y-2",
          isMobile && "w-1/2",
          playerState.isFullscreen && "w-full max-w-4xl",
        )}
      >
        <div className="flex items-center space-x-4">
          <button
            className={cn(
              "text-gray-700 hover:text-black theme-text theme-glow-hover rounded-full p-1",
              themeStyles.text,
            )}
            onClick={skipToPrevious}
            disabled={playerState.history.length === 0 && playerState.currentTime <= 3}
          >
            <SkipBack size={20} />
          </button>
          <button
            className={cn(
              "theme-bg text-white rounded-full p-2 hover:bg-gray-800 dark:hover:bg-gray-200 theme-glow-hover",
              isLoading && "opacity-50 cursor-not-allowed",
            )}
            onClick={togglePlayback}
            disabled={isLoading || !playerState.currentTrack}
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            {playerState.isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button
            className={cn(
              "text-gray-700 hover:text-black theme-text theme-glow-hover rounded-full p-1",
              themeStyles.text,
            )}
            onClick={skipToNext}
            disabled={playerState.queue.length === 0}
          >
            <SkipForward size={20} />
          </button>
        </div>

        {playerState.currentTrack && (
          <div className="flex items-center w-full space-x-2">
            <span className={cn("text-xs", themeStyles.text)}>{formatTime(playerState.currentTime)}</span>
            <Slider
              className="w-full"
              value={[playerState.currentTime]}
              max={playerState.currentTrack.duration || 100}
              step={1}
              onValueChange={handleSeek}
            />
            <span className={cn("text-xs", themeStyles.text)}>
              {formatTime(playerState.currentTrack.duration || 0)}
            </span>
          </div>
        )}
      </div>

      {!isMobile && (
        <div
          className={cn(
            "w-1/3 flex justify-end items-center",
            playerState.isFullscreen && "w-full max-w-4xl justify-between mt-4",
          )}
        >
          <div className="flex items-center">
            <button
              className={cn("text-gray-700 mr-2 theme-text theme-glow-hover rounded-full p-1", themeStyles.text)}
              onClick={toggleMute}
            >
              {playerState.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <Slider
              className="w-24 md:w-32"
              defaultValue={[playerState.volume]}
              value={[playerState.volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
            />
          </div>

          {playerState.currentTrack && !playerState.currentTrack.isLocal && settings.videoEnabled && (
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="ml-4 theme-glow-hover">
              {playerState.isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </Button>
          )}
        </div>
      )}

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={playerState.currentTrack?.audioUrl}
        className="hidden"
        onError={(e) => {
          console.error("Audio error:", e)
          toast({
            title: "Playback Error",
            description: "There was an error playing this track. Please try another one.",
            variant: "destructive",
          })
        }}
      />
    </div>
  )
}

