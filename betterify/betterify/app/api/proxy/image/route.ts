import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get("url")

  if (!imageUrl) {
    return new Response("Missing image URL", { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const contentType = response.headers.get("content-type") || "image/jpeg"
    const buffer = await response.arrayBuffer()

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error("Error proxying image:", error)
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 })
  }
}

