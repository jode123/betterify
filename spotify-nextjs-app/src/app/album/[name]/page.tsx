'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ImageWithFallback } from '@/components/ImageWithFallback'

interface AlbumTrack {
  name: string;
  duration: string;
  artist: string;
}

interface AlbumDetails {
  name: string;
  artist: string;
  image: string;
  tracks: AlbumTrack[];
}

export default function AlbumPage() {
  const params = useParams()
  const [album, setAlbum] = useState<AlbumDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY

      // Add null check and type assertion for params
      if (!params?.name || typeof params.name !== 'string') {
        console.error('Invalid album parameter:', params)
        setLoading(false)
        return
      }

      try {
        // Decode and split the combined name parameter
        const combined = decodeURIComponent(params.name)
        const separatorIndex = combined.lastIndexOf(' - ')
        
        // Handle case where there's no separator
        if (separatorIndex === -1) {
          console.error('Invalid album URL format:', combined)
          setLoading(false)
          return
        }

        const artistName = combined.substring(0, separatorIndex)
        const albumName = combined.substring(separatorIndex + 3)

        console.log('Fetching:', { artistName, albumName }) // Debug log

        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${encodeURIComponent(artistName)}&album=${encodeURIComponent(albumName)}&format=json`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch album details: ${response.status}`)
        }

        const data = await response.json()

        if (data.album) {
          setAlbum({
            name: data.album.name,
            artist: data.album.artist,
            image: data.album.image?.reverse()[0]?.['#text'] || '/default-album.png',
            tracks: data.album.tracks?.track?.map((track: any) => ({
              name: track.name,
              duration: track.duration || '0',
              artist: track.artist?.name || data.album.artist
            })) || []
          })
        }
      } catch (error) {
        console.error('Error fetching album details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbumDetails()
  }, [params])

  if (loading) return <div>Loading...</div>
  if (!album) return <div>Album not found</div>

  return (
    <div className="min-h-screen bg-[var(--background-primary)] p-4 md:p-8">
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
            <div key={index} className="track-container">
              <span className="track-number">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              
              <div className="track-art">
                <ImageWithFallback
                  src={album.image}
                  alt={album.name}
                  className="w-full h-full object-cover"
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
    </div>
  );
}