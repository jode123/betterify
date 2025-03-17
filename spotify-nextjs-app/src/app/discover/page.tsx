'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getProxiedImageUrl } from '@/lib/imageProxy'
import { useRouter } from 'next/navigation'
import { PlaylistCard } from '@/components/PlaylistCard'
import { TouchHandler } from '@/components/TouchHandler'

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

// Add this type near your other interfaces
interface ArtistCardProps {
  artist: Artist;
  onClick: (artist: Artist) => void;
}

interface AlbumCardProps {
  album: FeaturedAlbum;
  onClick: (album: FeaturedAlbum) => void;
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

// Update the ImageWithFallback component
const ImageWithFallback = ({ src, alt, className, isArtist }: { 
  src: string; 
  alt: string; 
  className: string; 
  isArtist?: boolean 
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const defaultImage = isArtist ? '/default-artist.png' : '/default-album.png';

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    console.log('Image failed to load:', src);
    setImgSrc(defaultImage);
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[var(--background-secondary)] animate-pulse rounded-lg" />
      )}
      <img 
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

// Update the fetch function to use proper types
const fetchLastFmData = async () => {
  const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY
  const BASE_URL = 'https://ws.audioscrobbler.com/2.0'

  try {
    if (!API_KEY) {
      console.error('API Key missing at runtime');
      throw new Error('Last.fm API key is missing');
    }

    // Create the requests with proper error handling
    const makeRequest = async (method: string, tag?: string) => {
      const params = new URLSearchParams({
        method,
        api_key: API_KEY,
        format: 'json',
        limit: '15'
      });
      if (tag) params.append('tag', tag);
      
      const response = await fetch(`${BASE_URL}/?${params}`);
      if (!response.ok) {
        console.error(`${method} request failed:`, {
          status: response.status,
          statusText: response.statusText,
          url: response.url.replace(API_KEY, 'REDACTED')
        });
        return null;
      }
      return response.json();
    };

    // Make all requests with individual error handling
    const [artistsData, albumsData, tracksData, featuredData] = await Promise.all([
      makeRequest('chart.gettopartists'),
      makeRequest('tag.gettopalbums', 'indie'),
      makeRequest('chart.gettoptracks'),
      makeRequest('tag.gettopalbums', 'featured')
    ]);

    // Process artists if available
    const artists = artistsData?.artists?.artist
      ?.filter((artist: LastFmArtist) => artist?.name && artist?.image?.length > 0)
      ?.map((artist: LastFmArtist) => {
        const artistImage = artist.image
          .reverse()
          .find(img => img?.['#text'] && img['#text'].startsWith('http'))?.['#text']
          || '/default-artist.png';

        return {
          name: artist.name,
          image: artistImage,
          listeners: artist.listeners || '0'
        };
      }) || [];

    // Process albums if available
    const albums = albumsData?.albums?.album
      ?.filter((album: LastFmAlbum) => album?.name && album?.artist?.name && album?.image?.length > 0)
      ?.map((album: LastFmAlbum) => ({
        name: album.name,
        artist: album.artist.name,
        image: album.image
          .reverse()
          .find(img => img?.['#text'] && img['#text'].startsWith('http'))?.['#text']
          || '/default-album.png'
      })) || [];

    // Process featured albums
    const featuredAlbums = featuredData?.albums?.album
      ?.filter((album: LastFmAlbum) => album?.name && album?.artist?.name && album?.image?.length > 0)
      ?.map((album: LastFmAlbum) => {
        const albumImage = album.image
          .reverse()
          .find(img => img?.['#text'] && img['#text'].startsWith('http'))?.['#text']
          || '/default-album.png';

        return {
          name: album.name,
          artist: album.artist.name,
          image: albumImage,
          playcount: album.playcount || '0'
        };
      }) || [];

    return { artists, albums, tracks: [], featuredAlbums };

  } catch (error) {
    console.error('Last.fm API Error:', error);
    return {
      artists: [],
      albums: [],
      tracks: [],
      featuredAlbums: []
    };
  }
};

// Add this helper function before your component
const ScrollButton = ({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`
      scroll-button ${direction}
      hidden md:flex /* Hide on mobile since we'll use native scrolling */
      items-center justify-center
      w-10 h-10
      bg-black/50 
      rounded-full
      text-white
      absolute
      top-1/2
      -translate-y-1/2
      ${direction === 'left' ? 'left-2' : 'right-2'}
      z-10
    `}
  >
    {direction === 'left' ? '←' : '→'}
  </button>
)

// Add this component above your DiscoverPage component
const ArtistCard = ({ artist, onClick }: ArtistCardProps) => {
  return (
    <TouchHandler
      onTap={() => onClick(artist)}
      className="card-container"
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-[var(--background-secondary)]">
        <ImageWithFallback
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover"
          isArtist={true}
        />
      </div>
      <div className="mt-2">
        <h3 className="musish-card-title">{artist.name}</h3>
        <p className="musish-card-subtitle">
          {parseInt(artist.listeners).toLocaleString()} listeners
        </p>
      </div>
    </TouchHandler>
  );
};

const AlbumCard = ({ album, onClick }: AlbumCardProps) => {
  return (
    <TouchHandler
      onTap={() => onClick(album)}
      className="card-container"
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-[var(--background-secondary)]">
        <ImageWithFallback
          src={album.image}
          alt={album.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mt-2">
        <h3 className="musish-card-title">{album.name}</h3>
        <p className="musish-card-subtitle">{album.artist}</p>
      </div>
    </TouchHandler>
  );
};

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

  // Add this inside your DiscoverPage component
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  const handleTouchEnd = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      scroll(ref, swipeDistance > 0 ? 'right' : 'left');
    }
  }

  // Add debug state
  const [debug, setDebug] = useState({
    artistsLength: 0,
    albumsLength: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('API Key present:', !!process.env.NEXT_PUBLIC_LASTFM_API_KEY);
      try {
        const data = await fetchLastFmData();
        console.log('Fetched data:', data); // Debug log
        
        if (data.artists && data.featuredAlbums) {
          setTopArtists(data.artists);
          setFeaturedAlbums(data.featuredAlbums);
          // Update debug info
          setDebug({
            artistsLength: data.artists.length,
            albumsLength: data.featuredAlbums.length,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter()

  const handleArtistClick = useCallback((artist: Artist) => {
    router.push(`/artist/${encodeURIComponent(artist.name)}`);
  }, [router]);

  const handleAlbumClick = useCallback((album: FeaturedAlbum) => {
    const combinedName = `${album.artist} - ${album.name}`
    router.push(`/album/${encodeURIComponent(combinedName)}`)
  }, [router])

  // Modified return statement with simpler structure
  return (
    <div className="min-h-screen bg-[var(--background-primary)]">
      {loading ? (
        <LoadingState />
      ) : (
        <div className="px-4 py-8">
          <h1 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-6 md:mb-8">
            Discover
          </h1>

          {/* Artists Section */}
          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-4">
              Top Artists
            </h2>
            
            <div className="relative">
              <div 
                className="overflow-x-auto scrollbar-hide -mx-4 px-4"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <div className="flex gap-3 md:gap-4">
                  {topArtists.map((artist, index) => (
                    <ArtistCard
                      key={index}
                      artist={artist}
                      onClick={handleArtistClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Featured Albums Section */}
          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-4">
              Featured Albums
            </h2>
            
            <div className="relative">
              <div 
                className="overflow-x-auto scrollbar-hide -mx-4 px-4"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <div className="flex gap-3 md:gap-4">
                  {featuredAlbums.map((album, index) => (
                    <AlbumCard
                      key={index}
                      album={album}
                      onClick={handleAlbumClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}