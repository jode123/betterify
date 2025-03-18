import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_PIPED_PROXY_URL || 'http://localhost:8080'
  
  try {
    const response = await fetch(`${baseUrl}/proxy`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Piped API error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}