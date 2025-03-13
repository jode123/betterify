import { useState } from 'react'
import { getProxiedImageUrl } from '@/lib/imageProxy'

export const HeroBackground = ({ imageUrl }: { imageUrl: string }) => {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="absolute inset-0 h-[500px]">
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${error ? '/default-artist.png' : getProxiedImageUrl(imageUrl)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px)',
          transform: 'scale(1.2)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background-primary)]/60 to-[var(--background-primary)]" />
      <img 
        src={getProxiedImageUrl(imageUrl)}
        alt=""
        className="hidden"
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}