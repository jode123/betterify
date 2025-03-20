import { NextResponse } from "next/server"

// Use the public Piped API
const PIPED_API_URL = "https://pipedapi.kavin.rocks"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")
  const filter = url.searchParams.get("filter") || "music"

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`${PIPED_API_URL}/search?q=${encodeURIComponent(query)}&filter=${filter}`)

    if (!response.ok) {
      throw new Error(`Failed to search Piped: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data.items || [])
  } catch (error) {
    console.error("Error searching Piped:", error)
    return NextResponse.json({ error: "Failed to search Piped" }, { status: 500 })
  }
}

