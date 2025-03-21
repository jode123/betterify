import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { getAuth } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  try {
    // Check if the user is authenticated
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the data to sync from the request body
    const { playlists, settings, spotifyData } = await request.json()

    // Get the user from ClerkClient
    const user = await clerkClient.users.getUser(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update the user's public metadata
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        ...(playlists && { playlists }),
        ...(settings && { settings }),
        ...(spotifyData && {
          spotifyToken: spotifyData.accessToken,
          spotifyRefreshToken: spotifyData.refreshToken,
          spotifyTokenExpiry: spotifyData.tokenExpiry,
        }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error syncing user data:", error)
    return NextResponse.json({ error: "Failed to sync user data" }, { status: 500 })
  }
}

