'use client'

import { useEffect, useRef, useState } from 'react'
import { getProxiedStreamUrl, searchPipedMusic } from '@/lib/pipedProxy'
import { getLastFmMetadata } from '@/lib/lastfmProxy'

interface MusicPlayerProps {
  videoId: string | null;
  isPlaying: boolean;
  onEnded: () => void
  onError: () => void
  trackName: string
  artist: string
}

export function MusicPlayer({ trackName, artist, onError }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [metadata, setMetadata] = useState<any>(null)

  useEffect(() => {
    const initializeTrack = async () => {
      setIsLoading(true)
      try {
        // Fetch Last.fm metadata
        const lastFmData = await getLastFmMetadata('track.getInfo', {
          track: trackName,
          artist: artist
        });

        if (lastFmData) {
          setMetadata(lastFmData);
        }

        // Get audio stream from Piped
        const searchResults = await searchPipedMusic(`${artist} ${trackName}`)
        if (searchResults && searchResults.length > 0) {
          const proxyUrl = await getProxiedStreamUrl(searchResults[0].id)
          setStreamUrl(proxyUrl)
        }
      } catch (error) {
        console.error('Error initializing track:', error)
        onError?.()
      } finally {
        setIsLoading(false)
      }
    }

    initializeTrack()
  }, [trackName, artist, onError])

  const togglePlay = async () => {
    if (!audioRef.current || !streamUrl) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        await audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error('Playback error:', error)
      onError?.()
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={togglePlay}
        disabled={isLoading || !streamUrl}
        className={`p-2 rounded-full ${
          isLoading ? 'bg-gray-500' : 'bg-[var(--accent-color)]'
        } text-white hover:scale-105 transition-transform disabled:opacity-50`}
      >
        {isLoading ? (
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      
      <div className="flex-1">
        <div className="text-[var(--text-primary)] font-medium">{trackName}</div>
        <div className="text-[var(--text-secondary)] text-sm">{artist}</div>
      </div>

      <audio
        ref={audioRef}
        src={streamUrl || undefined}
        onEnded={() => setIsPlaying(false)}
        onError={onError}
      />
    </div>
  )
}