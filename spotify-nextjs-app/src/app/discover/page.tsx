'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getProxiedImageUrl } from '@/lib/imageProxy'
import { useRouter } from 'next/navigation'
import { PlaylistCard } from '@/components/PlaylistCard'

// Define Last.fm API types
interface LastFmImage {
  '#text': string
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega'
}

interface LastFmArtist {
  name: string
  listeners: string
  image: LastFmImage[]
}

interface LastFmAlbum {
  name: string
  artist: {
    name: string
  }
  image: LastFmImage[]
  playcount?: string
}

interface Artist {
  name: string
  image: string
  listeners: string
}

interface Album {
  name: string
  artist: string
  image: string
  playcount?: string
}

interface TrackMetadata {
  name: string
  artist: string
  album: string
  duration: string
  playCount: string
}

// Add this to your existing interfaces
interface LastFmTrack {
  name: string
  artist: {
    name: string
  }
  duration: string
  playcount: string
  album: {
    title: string
  }
}

// Add to your interfaces at the top
interface FeaturedAlbum {
  name: string
  artist: string
  image: string
  playcount?: string
}

// Add to the same file, above the component
const LoadingState = () => (
  <div className="musish-container flex items-center justify-center">
    <div className="text-[var(--text-primary)] text-xl animate-pulse">
      Loading your personalized experience...
    </div>
  </div>
)

const ErrorState = () => (
  <div className="musish-container flex items-center justify-center">
    <div className="text-[var(--system-red)] text-xl">
      Unable to load content. Please try again later.
    </div>
  </div>
)

// Add this component near your other helper components
const ImageWithFallback = ({ src, alt, className, isArtist }: { src: string; alt: string; className: string; isArtist?: boolean }) => {
  const [error, setError] = useState(false)
  const defaultImage = isArtist ? '/default-artist.png' : '/default-album.png'

  return (
    <img 
      src={error ? defaultImage : getProxiedImageUrl(src)}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  )
}

// Update the fetch function to use proper types
const fetchLastFmData = async () => {
  const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY
  const BASE_URL = 'https://ws.audioscrobbler.com/2.0'
  
  try {
    const [artistsRes, albumsRes, tracksRes, featuredRes] = await Promise.all([
      // Updated artist endpoint to include more image metadata
      fetch(`${BASE_URL}/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=15&size=mega`),
      fetch(`${BASE_URL}/?method=tag.gettopalbums&tag=indie&api_key=${API_KEY}&format=json&limit=15`),
      fetch(`${BASE_URL}/?method=chart.gettoptracks&api_key=${API_KEY}&format=json&limit=15`),
      // Increased the limit from 12 to 50 for featured albums
      fetch(`${BASE_URL}/?method=tag.gettopalbums&tag=featured&api_key=${API_KEY}&format=json&limit=50`)
    ])

    const [artistsData, albumsData, tracksData, featuredData] = await Promise.all([
      artistsRes.json(),
      albumsRes.json(),
      tracksRes.json(),
      featuredRes.json()
    ])

    // Add console.log to debug artist data
    console.log('Raw artist data:', artistsData.artists.artist[0])

    const artists = artistsData.artists.artist.map((artist: LastFmArtist) => ({
      name: artist.name,
      // Try multiple image sizes in order of preference
      image: artist.image.find(img => img.size === 'mega')?.['#text'] ||
             artist.image.find(img => img.size === 'extralarge')?.['#text'] ||
             artist.image.find(img => img.size === 'large')?.['#text'] ||
             '/default-artist.png',
      listeners: artist.listeners
    }))

    const albums = albumsData.albums.album.map((album: LastFmAlbum) => ({
      name: album.name,
      artist: album.artist.name,
      image: album.image.find(img => img.size === 'extralarge')?.['#text'] || album.image[3]?.['#text']
    }))

    const tracks = tracksData.tracks.track.map((track: LastFmTrack) => ({
      name: track.name,
      artist: track.artist.name,
      album: track.album?.title || '',
      duration: track.duration,
      playCount: track.playcount
    }))

    const featuredAlbums = featuredData.albums.album.map((album: LastFmAlbum) => ({
      name: album.name,
      artist: album.artist.name,
      image: album.image.find(img => img.size === 'extralarge')?.['#text'] || 
             album.image.find(img => img.size === 'large')?.['#text'] || 
             album.image[3]?.['#text'],
      playcount: album.playcount
    }))

    console.log('Processed data:', { artists, albums, tracks, featuredAlbums })

    return { artists, albums, tracks, featuredAlbums }
  } catch (error) {
    console.error('Error fetching Last.fm data:', error)
    throw error
  }
}

// Add this helper function before your component
const ScrollButton = ({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`scroll-button ${direction}`}
  >
    {direction === 'left' ? '←' : '→'}
  </button>
)

export default function DiscoverPage() {
  const [topArtists, setTopArtists] = useState<Artist[]>([])
  const [topAlbums, setTopAlbums] = useState<Album[]>([])
  const [tracks, setTracks] = useState<TrackMetadata[]>([])
  const [featuredAlbums, setFeaturedAlbums] = useState<FeaturedAlbum[]>([])
  const [loading, setLoading] = useState(true)

  // Add refs for scroll containers
  const artistsRef = useRef<HTMLDivElement>(null)
  const albumsRef = useRef<HTMLDivElement>(null)

  // Add scroll handler
  const scroll = useCallback((ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 600 // Adjust this value to control scroll distance
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { artists, albums, tracks, featuredAlbums } = await fetchLastFmData()
        setTopArtists(artists)
        setTopAlbums(albums)
        setTracks(tracks)
        setFeaturedAlbums(featuredAlbums)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const router = useRouter()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background-primary)]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[var(--text-primary)] text-xl"
        >
          Loading...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="musish-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto pb-24"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-[var(--text-primary)] mb-12"
        >
          Discover
        </motion.h1>

        {/* Artists Section */}
        <div className="musish-section">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Top Artists</h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                Trending artists from around the world
              </p>
            </div>
            <button className="text-[var(--accent-color)] hover:text-[var(--system-pink)] text-sm font-medium transition-colors">
              See All
            </button>
          </div>
          <div className="relative">
            <div ref={artistsRef} className="scroll-container">
              <div className="horizontal-grid">
                {topArtists.map((artist, index) => (
                  <motion.div
                    key={artist.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-container cursor-pointer"
                    onClick={() => router.push(`/artist/${encodeURIComponent(artist.name)}`)}
                  >
                    <ImageWithFallback 
                      src={artist.image}
                      alt={`${artist.name} artist photo`}
                      className="musish-card-image rounded-full"
                      isArtist={true}
                    />
                    <div className="musish-card-content">
                      <h3 className="musish-card-title">{artist.name}</h3>
                      <p className="musish-card-subtitle">
                        {parseInt(artist.listeners).toLocaleString()} listeners
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <ScrollButton direction="left" onClick={() => scroll(artistsRef, 'left')} />
            <ScrollButton direction="right" onClick={() => scroll(artistsRef, 'right')} />
          </div>
        </div>

        {/* Featured Albums Section */}
        <div className="musish-section mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Featured Albums</h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                Curated selection of must-hear albums
              </p>
            </div>
            <button className="text-[var(--accent-color)] hover:text-[var(--system-pink)] text-sm font-medium transition-colors">
              See All
            </button>
          </div>
          <div className="relative">
            <div ref={albumsRef} className="scroll-container">
              <div className="horizontal-grid">
                {featuredAlbums.slice(0, 50).map((album, index) => ( // Show up to 50 albums
                  <PlaylistCard
                    key={album.name}
                    item={{
                      ...album,
                      type: 'featured',
                      artist: album.artist
                    }}
                  />
                ))}
              </div>
            </div>
            <ScrollButton direction="left" onClick={() => scroll(albumsRef, 'left')} />
            <ScrollButton direction="right" onClick={() => scroll(albumsRef, 'right')} />
          </div>
        </div>

      </motion.div>
    </div>
  )
}