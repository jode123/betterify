import { getProxiedImageUrl } from '@/lib/imageProxy'
import Image from 'next/image'
import { useState } from 'react'

export const ImageWithFallback = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => {
  const [error, setError] = useState(false)

  return (
    <img
      src={error ? '/default-artist.png' : getProxiedImageUrl(src)}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  )
}