'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ImageWithFallback } from '@/components/ImageWithFallback'
import { getProxiedImageUrl } from '@/lib/imageProxy'
import { HeroBackground } from '@/components/HeroBackground'
import { useRouter } from 'next/navigation'
import { PlaylistCard } from '@/components/PlaylistCard'

interface ArtistInfo {
  name: string
  image: string
  bio: string
  listeners: string
  playcount: string
}

interface ArtistAlbum {
  name: string
  image: string
  playcount: string
}

interface ArtistTrack {
  name: string
  playcount: string
  duration: string
}

export default function ArtistPage({ params }: { params: { name: string } }) {
  const router = useRouter()
  const [artist, setArtist] = useState<ArtistInfo | null>(null)
  const [albums, setAlbums] = useState<ArtistAlbum[]>([])
  const [tracks, setTracks] = useState<ArtistTrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtistData = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY
      const BASE_URL = 'https://ws.audioscrobbler.com/2.0'
      
      try {
        const [artistRes, albumsRes, tracksRes] = await Promise.all([
          fetch(`${BASE_URL}/?method=artist.getinfo&artist=${params.name}&api_key=${API_KEY}&format=json`),
          fetch(`${BASE_URL}/?method=artist.gettopalbums&artist=${params.name}&api_key=${API_KEY}&format=json&limit=12`),
          fetch(`${BASE_URL}/?method=artist.gettoptracks&artist=${params.name}&api_key=${API_KEY}&format=json&limit=10`)
        ])

        const [artistData, albumsData, tracksData] = await Promise.all([
          artistRes.json(),
          albumsRes.json(),
          tracksRes.json()
        ])

        // Debug the image URL
        console.log('Artist images:', artistData.artist.image)
        
        // Get the largest image (usually the last one in the array)
        const largestImage = artistData.artist.image?.reduce((acc: any, curr: any) => {
          if (!acc || (curr.size === 'mega' || curr.size === 'extralarge')) {
            return curr;
          }
          return acc;
        }, null);

        setArtist({
          name: artistData.artist.name,
          // Use the largest image URL or fallback
          image: largestImage?.['#text'] || '/default-artist.png',
          bio: artistData.artist.bio.summary,
          listeners: artistData.artist.stats.listeners,
          playcount: artistData.artist.stats.playcount
        })

        setAlbums(albumsData.topalbums.album.map((album: any) => ({
          name: album.name,
          image: album.image.find((img: any) => img.size === 'large')?.['#text'] || 
                 album.image.find((img: any) => img.size === 'medium')?.['#text'] ||
                 '/default-album.png',
          playcount: parseInt(album.playcount)
        })))

        setTracks(tracksData.toptracks.track.map((track: any) => ({
          name: track.name,
          playcount: track.playcount,
          duration: track.duration
        })))

        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setLoading(false)
        router.push('/')
      }
    }

    fetchArtistData()
  }, [params.name, router])

  if (loading) {
    return (
      <div className="musish-container flex items-center justify-center">
        <div className="text-[var(--text-primary)] text-xl animate-pulse">
          Loading artist...
        </div>
      </div>
    )
  }

  if (!artist) return null

  return (
    <div className="artist-page-container">
      <header className="artist-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="artist-name">{artist?.name}</h1>
          <div className="artist-stats">
            {parseInt(artist?.listeners || '0').toLocaleString()} monthly listeners
          </div>
        </motion.div>
      </header>

      <main className="artist-content">
        {/* Top Songs Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Top Songs</h2>
          <div className="space-y-2 max-w-4xl">
            {tracks.slice(0, 5).map((track, index) => (
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
                  <div className="text-[var(--text-secondary)] text-sm">
                    {parseInt(track.playcount).toLocaleString()} plays
                  </div>
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

        {/* Albums Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {albums.map((album) => (
              <PlaylistCard 
                key={album.name} 
                item={{
                  ...album,
                  type: 'album'
                }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}