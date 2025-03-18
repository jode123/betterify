const PIPED_INSTANCE = 'https://pipedapi.kavin.rocks'

interface SearchResult {
  id: string
  title: string
  author: string
  duration: number
}

export async function searchMusic(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `${PIPED_INSTANCE}/search?q=${encodeURIComponent(query)}&filter=music`
    )
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

export async function getAudioStream(videoId: string): Promise<string> {
  try {
    const response = await fetch(`${PIPED_INSTANCE}/streams/${videoId}`)
    const data = await response.json()
    // Get the highest quality audio stream
    const audioStream = data.audioStreams
      .sort((a: any, b: any) => b.bitrate - a.bitrate)[0]
    return audioStream.url
  } catch (error) {
    console.error('Stream error:', error)
    throw error
  }
}