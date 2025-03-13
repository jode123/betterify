import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add caching headers for proxied images
  if (request.nextUrl.pathname.startsWith('/api/proxy/image')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000')
  }

  return response
}