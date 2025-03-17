export function getProxiedUrl(url: string): string {
  if (!url) return '/default-album.png'
  
  // Use your own proxy or a CORS proxy service
  return `/api/proxy?url=${encodeURIComponent(url)}`
}