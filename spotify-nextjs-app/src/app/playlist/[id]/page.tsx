'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Track {
  id: string
  name: string
  album: {
    images: { url: string }[]
    name: string
  }
  artists: { name: string }[]
  duration_ms: number
}

export default function PlaylistDetails() {
  const params = useParams()
  const [tracks, setTracks] = useState<Track[]>([])
  const [playlistName, setPlaylistName] = useState('')
  const [playlistImage, setPlaylistImage] = useState('')
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
        setPlaylistImage(playlistData.images[0]?.url || '')
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
      <div className="flex min-h-screen items-center justify-center bg-[#000000]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {/* Hero Section */}
        <div 
          className="h-[50vh] relative bg-cover bg-center"
          style={{
            backgroundImage: `url(${playlistImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
          <div className="absolute bottom-0 p-8 w-full">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl font-bold text-white mb-4">{playlistName}</h1>
              <p className="text-gray-300">{tracks.length} songs</p>
            </motion.div>
          </div>
        </div>

        {/* Track List */}
        <div className="px-8 py-4">
          <div className="flex items-center text-gray-400 text-sm px-4 py-2 border-b border-gray-800">
            <div className="w-12">#</div>
            <div className="w-12"></div>
            <div className="flex-1">TITLE</div>
            <div className="w-48">ALBUM</div>
            <div className="w-24 text-right">TIME</div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center p-4 hover:bg-white/5 rounded-lg group transition-colors"
              >
                <div className="w-12 text-gray-400">{index + 1}</div>
                <div className="w-12">
                  <img 
                    src={track.album.images[2]?.url || '/default-album.png'}
                    alt={track.name}
                    className="w-10 h-10 rounded shadow-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{track.name}</div>
                  <div className="text-gray-400 text-sm truncate">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </div>
                </div>
                <div className="w-48 text-gray-400 text-sm truncate">
                  {track.album.name}
                </div>
                <div className="w-24 text-gray-400 text-sm text-right">
                  {formatDuration(track.duration_ms)}
                </div>
                <button className="opacity-0 group-hover:opacity-100 ml-4 p-2 rounded-full bg-[#1db954] text-black">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}