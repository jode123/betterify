export const getProxiedImageUrl = (url: string) => {
  // Debug the incoming URL
  console.log('Original image URL:', url)

  if (!url || url === '') {
    console.log('No URL provided, using default')
    return '/default-artist.png'
  }

  // Handle Last.fm URLs specifically
  if (url.includes('last.fm') || url.includes('lastfm')) {
    // Ensure we're getting the highest quality image
    const cleanUrl = url
      .replace(/\/\d+x\d+\//, '/') // Remove size constraints
      .replace('/34s/', '/') // Remove small size indicator
      .replace('/64s/', '/') // Remove medium size indicator
      .replace('/174s/', '/') // Remove large size indicator
      .replace('/300x300/', '/') // Remove specific size
      .replace('/Plus/', '/') // Remove Plus indicator if present

    console.log('Cleaned Last.fm URL:', cleanUrl)
    return `/api/proxy?url=${encodeURIComponent(cleanUrl)}`
  }

  try {
    new URL(url) // Validate URL format
    return `/api/proxy?url=${encodeURIComponent(url)}`
  } catch {
    console.warn('Invalid image URL:', url)
    return '/default-artist.png'
  }
}