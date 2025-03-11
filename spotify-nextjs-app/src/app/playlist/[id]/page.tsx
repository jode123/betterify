'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Track {
  id: string
  name: string
  album: {
    images: { url: string }[]
  }
  artists: { name: string }[]
  duration_ms: number
}

export default function PlaylistDetails() {
  const params = useParams()
  const [tracks, setTracks] = useState<Track[]>([])
  const [playlistName, setPlaylistName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      const token = localStorage.getItem('spotify_token')
      if (!token || !params?.id) return

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${params.id}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = await response.json()
        setTracks(data.items.map((item: any) => item.track))

        // Fetch playlist details for the name
        const playlistResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const playlistData = await playlistResponse.json()
        setPlaylistName(playlistData.name)
      } catch (error) {
        console.error('Error fetching playlist tracks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylistTracks()
  }, [params?.id])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Playlists
        </Link>

        <h1 className="text-4xl font-bold mb-8">{playlistName}</h1>

        <div className="bg-[#282828] rounded-lg shadow-xl">
          {tracks.map((track, index) => (
            <div 
              key={track.id}
              className="flex items-center p-4 hover:bg-[#383838] transition-colors border-b border-[#383838] last:border-0"
            >
              <div className="w-12 text-gray-400 font-mono">{index + 1}</div>
              <img 
                src={track.album.images[2]?.url || '/default-album.png'} 
                alt={track.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <div className="font-medium">{track.name}</div>
                <div className="text-sm text-gray-400">
                  {track.artists.map(artist => artist.name).join(', ')}
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                {formatDuration(track.duration_ms)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}