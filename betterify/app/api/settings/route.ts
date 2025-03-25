import { NextResponse } from "next/server"
import { auth } from "@/auth"
import fs from "fs"
import path from "path"

// Define the settings file path
const SETTINGS_DIR = path.join(process.cwd(), "data")
const SETTINGS_FILE = path.join(SETTINGS_DIR, "settings.json")

// Ensure the settings directory exists
try {
  if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true })
  }

  // Create settings file if it doesn't exist
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(
      SETTINGS_FILE,
      JSON.stringify({
        lastfm: {
          apiKey: "",
          apiSecret: "",
        },
        spotify: {
          clientId: "",
          clientSecret: "",
          redirectUri: "",
        },
      }),
      "utf8",
    )
  }
} catch (error) {
  console.error("Failed to initialize settings file:", error)
}

// GET /api/settings - Get settings
export async function GET(request: Request) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Read settings from file
    const settingsData = fs.readFileSync(SETTINGS_FILE, "utf8")
    const settings = JSON.parse(settingsData)

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// POST /api/settings - Update settings
export async function POST(request: Request) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get settings from request
    const newSettings = await request.json()

    // Validate settings
    if (!newSettings) {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 })
    }

    // Read current settings
    const settingsData = fs.readFileSync(SETTINGS_FILE, "utf8")
    const currentSettings = JSON.parse(settingsData)

    // Merge new settings with current settings
    const updatedSettings = {
      ...currentSettings,
      ...newSettings,
    }

    // Write updated settings to file
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2), "utf8")

    // Update environment variables
    if (newSettings.lastfm?.apiKey) {
      process.env.LASTFM_API_KEY = newSettings.lastfm.apiKey
    }

    if (newSettings.lastfm?.apiSecret) {
      process.env.LASTFM_API_SECRET = newSettings.lastfm.apiSecret
    }

    if (newSettings.spotify?.clientId) {
      process.env.SPOTIFY_CLIENT_ID = newSettings.spotify.clientId
    }

    if (newSettings.spotify?.clientSecret) {
      process.env.SPOTIFY_CLIENT_SECRET = newSettings.spotify.clientSecret
    }

    if (newSettings.spotify?.redirectUri) {
      process.env.SPOTIFY_REDIRECT_URI = newSettings.spotify.redirectUri
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

