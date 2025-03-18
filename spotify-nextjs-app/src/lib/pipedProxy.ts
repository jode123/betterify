const PIPED_PROXY_URL = process.env.NEXT_PUBLIC_PIPED_PROXY_URL || 'http://localhost:8080'

export async function getProxiedStreamUrl(videoId: string): Promise<string> {
  try {
    const response = await fetch(`${PIPED_PROXY_URL}/streams/${videoId}`)
    if (!response.ok) throw new Error('Failed to get stream URL')
    
    const data = await response.json()
    const audioStream = data.audioStreams
      .sort((a: any, b: any) => b.bitrate - a.bitrate)[0]

    return `${PIPED_PROXY_URL}/proxy/${encodeURIComponent(audioStream.url)}`
  } catch (error) {
    console.error('Proxy stream error:', error)
    throw error
  }
}

export async function searchPipedMusic(query: string) {
  try {
    const response = await fetch(`${PIPED_PROXY_URL}/search?q=${encodeURIComponent(query)}&filter=music`)
    if (!response.ok) throw new Error('Search failed')
    
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}