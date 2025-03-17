import { NextResponse } from 'next/server'
import { getPipedApiInstance, refreshInstances } from '@/config/piped'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const filter = searchParams.get('filter')
    const videoId = searchParams.get('videoId')

    // Validate required parameters
    if (!videoId && (!query || !filter)) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    let url: string
    if (videoId) {
      url = `${getPipedApiInstance()}/streams/${videoId}`
    } else {
      url = `${getPipedApiInstance()}/search?q=${query}&filter=${filter}`
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000)
    })

    // Handle different error cases
    if (!response.ok) {
      // If instance fails, try to find a new one
      if (response.status >= 500) {
        await refreshInstances()
        // Retry the request once with new instance
        return GET(request)
      }

      throw new Error(`Piped API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Validate response data
    if (!data || (videoId && !data.audioStreams)) {
      throw new Error('Invalid response from Piped API')
    }

    return NextResponse.json(data)

  } catch (err: unknown) {
    console.error('Proxy error:', err)

    // Type guard for TypeError
    if (err instanceof TypeError) {
      return NextResponse.json(
        { error: 'Network error - API might be down' },
        { status: 503 }
      )
    }

    // Type guard for Error objects
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout' },
          { status: 504 }
        )
      }

      return NextResponse.json(
        { error: err.message || 'Failed to fetch from Piped API' },
        { status: 500 }
      )
    }

    // Fallback error response
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}