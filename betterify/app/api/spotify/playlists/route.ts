import { getFeaturedPlaylists, getCategories, getCategoryPlaylists } from "@/lib/spotify"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to get featured playlists first
    try {
      const playlists = await getFeaturedPlaylists()
      if (playlists && playlists.length > 0) {
        return NextResponse.json(playlists)
      }
    } catch (error) {
      console.error("Error fetching featured playlists, falling back to categories:", error)
    }

    // Fallback: Get playlists from a popular category
    const categories = await getCategories()
    if (!categories || categories.length === 0) {
      throw new Error("No categories found")
    }

    // Use the first category (usually "Top Lists" or similar)
    const categoryId = categories[0].id
    const categoryPlaylists = await getCategoryPlaylists(categoryId)

    return NextResponse.json(categoryPlaylists)
  } catch (error) {
    console.error("Error fetching playlists:", error)
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 })
  }
}

