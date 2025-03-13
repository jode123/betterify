'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ImageWithFallback } from '@/components/ImageWithFallback'

export default function AlbumPage({ params }: { params: { artist: string, name: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [album, setAlbum] = useState<any>(null)
  const [tracks, setTracks] = useState<any[]>([])

  useEffect(() => {
    const fetchAlbumData = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY
      const BASE_URL = 'https://ws.audioscrobbler.com/2.0'
      
      try {
        const albumRes = await fetch(
          `${BASE_URL}/?method=album.getinfo&artist=${params.artist}&album=${params.name}&api_key=${API_KEY}&format=json`
        )
        const albumData = await albumRes.json()

        setAlbum({
          name: albumData.album.name,
          artist: albumData.album.artist,
          image: albumData.album.image?.find((img: any) => img.size === 'extralarge')?.['#text'],
          playcount: albumData.album.playcount,
        })

        setTracks(albumData.album.tracks.track.map((track: any) => ({
          name: track.name,
          duration: track.duration,
        })))

        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setLoading(false)
      }
    }

    fetchAlbumData()
  }, [params.artist, params.name])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[var(--text-primary)] text-xl animate-pulse">
          Loading album...
        </div>
      </div>
    )
  }

  if (!album) return null

  return (
    <div className="album-page-container">
      <header className="album-header">
        <div className="flex items-start gap-8">
          <ImageWithFallback
            src={album.image}
            alt={album.name}
            className="w-64 h-64 rounded-lg shadow-xl"
          />
          <div>
            <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-4">{album.name}</h1>
            <div className="text-[var(--text-secondary)] text-xl mb-2">
              By {album.artist}
            </div>
            <div className="text-[var(--text-secondary)]">
              {parseInt(album.playcount).toLocaleString()} total plays
            </div>
          </div>
        </div>
      </header>

      <main className="album-content">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Tracks</h2>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <motion.div
                key={track.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center p-4 hover:bg-[var(--background-secondary)] rounded-lg transition-colors group"
              >
                <span className="text-[var(--text-secondary)] w-8">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[var(--text-primary)] font-medium">{track.name}</div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--accent-color)] text-white p-2.5 rounded-full shadow-lg hover:scale-105">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}