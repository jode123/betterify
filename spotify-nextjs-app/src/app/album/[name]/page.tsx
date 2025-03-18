'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ImageWithFallback } from '@/components/ImageWithFallback'
import { searchMusic, getAudioStream } from '@/utils/pipedApi'
import type { AlbumTrack, AlbumDetails } from '@/types/music'
import { MusicPlayer } from '@/components/MusicPlayer'

export default function AlbumPage({ params }: { params: { name: string } }) {
  const [album, setAlbum] = useState<AlbumDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&album=${params.name}&api_key=${API_KEY}&format=json`
        )
        const data = await response.json()
        setAlbum(data.album)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching album:', error)
        setLoading(false)
      }
    }

    fetchAlbumData()
  }, [params.name])

  const handleTrackClick = async (track: AlbumTrack, index: number) => {
    if (!album) return;
    
    setIsLoading(true);
    const query = `${track.artist} ${track.name} ${album.name}`;
    
    try {
      const result = await searchMusic(query);
      if (result?.id) {
        setCurrentTrack(index);
        setCurrentVideoId(result.id);
        setIsPlaying(true);
        console.log('Playing track:', {
          track: track.name,
          videoTitle: result.title
        });
      } else {
        console.error('No valid video ID found for:', query);
      }
    } catch (error) {
      console.error('Error playing track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackEnd = () => {
    // Play next track if available
    if (currentTrack !== null && currentTrack < album!.tracks.length - 1) {
      handleTrackClick(album!.tracks[currentTrack + 1], currentTrack + 1)
    } else {
      setCurrentTrack(null)
      setCurrentVideoId(null)
      setIsPlaying(false)
    }
  }

  const handlePlaybackError = () => {
    console.error('Playback error')
    setIsPlaying(false)
  }

  if (loading) return <div>Loading...</div>
  if (!album) return <div>Album not found</div>

  return (
    <div className="min-h-screen bg-[var(--background-primary)] p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Album Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-64 shrink-0">
            <ImageWithFallback
              src={album.image}
              alt={album.name}
              className="w-full aspect-square rounded-lg shadow-xl"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              {album.name}
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-4">
              {album.artist}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {album.tracks.length} songs
            </p>
          </div>
        </div>

        {/* Tracks List */}
        <div className="space-y-2">
          {album.tracks.map((track, index) => (
            <div 
              key={index} 
              className={`track-container cursor-pointer hover:bg-[var(--background-tertiary)] ${
                currentTrack === index ? 'bg-[var(--background-tertiary)]' : ''
              }`}
              onClick={() => handleTrackClick(track, index)}
            >
              <span className="track-number">
                {isLoading && currentTrack === index ? '...' : (index + 1).toString().padStart(2, '0')}
              </span>
              
              <div className="track-art">
                <ImageWithFallback
                  src={album.image}
                  alt={album.name}
                  className="w-full h-full object-cover"
                  priority={index < 5}
                />
              </div>
              
              <div className="track-info">
                <div className="track-title">{track.name}</div>
                {track.artist !== album.artist && (
                  <div className="track-artist">{track.artist}</div>
                )}
              </div>
              
              <span className="track-duration">
                {track.duration === '0' 
                  ? '--:--' 
                  : `${Math.floor(parseInt(track.duration) / 60)}:${(parseInt(track.duration) % 60).toString().padStart(2, '0')}`
                }
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Music Player */}
      <MusicPlayer
        videoId={currentVideoId}
        isPlaying={isPlaying}
        onEnded={handleTrackEnd}
        onError={handlePlaybackError}
        trackName={currentTrack !== null ? album.tracks[currentTrack].name : ''}
        artist={currentTrack !== null ? album.tracks[currentTrack].artist : ''}
      />
    </div>
  )
}