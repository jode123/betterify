'use client'

import { useRouter } from 'next/navigation'
import { ImageWithFallback } from './ImageWithFallback'
import { motion } from 'framer-motion'
import { getProxiedUrl } from '@/lib/proxy'

interface PlaylistCardProps {
  item: {
    name: string
    image: string
    playcount?: number | string
    type: 'album' | 'playlist' | 'featured'
    artist?: string
  }
}

export function PlaylistCard({ item }: PlaylistCardProps) {
  const router = useRouter()

  const handleClick = () => {
    console.log('Clicked album:', item.name) // Debug log
    
    if (item.type === 'album') {
      router.push(`/album/${encodeURIComponent(item.name)}`)
    } else if (item.type === 'featured' && item.artist) {
      router.push(`/album/${encodeURIComponent(item.artist)}/${encodeURIComponent(item.name)}`)
    }
  }

  return (
    <div 
      className="card-container cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <ImageWithFallback
          src={getProxiedUrl(item.image)}
          alt={item.name}
          className="musish-card-image"
        />
        <div className="musish-card-content">
          <h3 className="musish-card-title">{item.name}</h3>
          {item.artist && (
            <p className="musish-card-subtitle text-[var(--text-secondary)]">
              {item.artist}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export function AlbumCard({ album }: { album: any }) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/album/${encodeURIComponent(album.name)}`)
  }

  return (
    <div className="card-container" onClick={handleClick}>
      {/* ...existing card content... */}
    </div>
  )
}