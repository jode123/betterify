import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  isArtist?: boolean
  priority?: boolean // Add priority prop
}

export const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  isArtist = false,
  priority = false // Default to false
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState(true)
  const defaultImage = isArtist ? '/default-artist.png' : '/default-album.png'

  useEffect(() => {
    setImgSrc(src)
    setIsLoading(true)
  }, [src])

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        width={500}
        height={500}
        priority={priority}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(defaultImage)
          setIsLoading(false)
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-[var(--background-secondary)] animate-pulse rounded-lg" />
      )}
    </div>
  )
}