import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()
    const headers = new Headers()
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg')
    headers.set('Cache-Control', 'public, max-age=31536000')

    return new NextResponse(buffer, {
      headers,
      status: 200,
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return new NextResponse('Error fetching image', { status: 500 })
  }
}