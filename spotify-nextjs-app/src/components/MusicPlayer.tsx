'use client'

import { useEffect, useRef } from 'react'
import { getAudioStream } from '@/utils/pipedApi'

interface MusicPlayerProps {
  videoId: string | null
  isPlaying: boolean
  onEnded: () => void
  onError: () => void
}

export function MusicPlayer({ videoId, isPlaying, onEnded, onError }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const loadAndPlay = async () => {
      if (!videoId || !audioRef.current) return

      try {
        const streamUrl = await getAudioStream(videoId)
        if (streamUrl) {
          audioRef.current.src = streamUrl
          if (isPlaying) {
            await audioRef.current.play()
          }
        }
      } catch (error) {
        console.error('Error loading audio:', error)
        onError()
      }
    }

    loadAndPlay()
  }, [videoId, isPlaying, onError])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(onError)
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, onError])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--background-secondary)] p-4 shadow-lg">
      <audio
        ref={audioRef}
        onEnded={onEnded}
        onError={onError}
        className="w-full"
      />
    </div>
  )
}