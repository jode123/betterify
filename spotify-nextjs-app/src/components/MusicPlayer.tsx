'use client'

import { useState, useRef, useEffect } from 'react'

interface MusicPlayerProps {
  videoId: string | null
  isPlaying: boolean
  onEnded: () => void
  onError: () => void
}

export function MusicPlayer({ videoId, isPlaying, onEnded, onError }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!videoId) return

    const playAudio = async () => {
      setLoading(true)
      try {
        if (audioRef.current) {
          // Use Piped's stream endpoint
          const streamUrl = `https://pipedapi.kavin.rocks/streams/${videoId}`
          const response = await fetch(streamUrl)
          const data = await response.json()
          
          // Get the audio-only stream URL
          const audioStream = data.audioStreams?.[0]?.url
          if (audioStream) {
            audioRef.current.src = audioStream
            if (isPlaying) {
              await audioRef.current.play()
            }
          } else {
            onError()
          }
        }
      } catch (error) {
        console.error('Error playing audio:', error)
        onError()
      } finally {
        setLoading(false)
      }
    }

    playAudio()
  }, [videoId, isPlaying, onError])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--background-secondary)] p-4">
      <audio
        ref={audioRef}
        onEnded={onEnded}
        onError={onError}
        className="hidden"
      />
      {loading && <div>Loading audio...</div>}
    </div>
  )
}