import { getProxiedImageUrl } from '@/lib/imageProxy'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export const ImageWithFallback = ({ src, alt, className, isArtist = false }: {
  src: string;
  alt: string;
  className?: string;
  isArtist?: boolean;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={180}
      height={180}
      className={`${className} ${isLoading ? 'animate-pulse bg-gray-700' : ''}`}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setImgSrc(isArtist ? '/default-artist.png' : '/default-album.png');
      }}
    />
  );
};