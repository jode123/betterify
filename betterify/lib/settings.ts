import fs from "fs"
import path from "path"

// Define the settings file path
const SETTINGS_DIR = path.join(process.cwd(), "data")
const SETTINGS_FILE = path.join(SETTINGS_DIR, "settings.json")

interface Settings {
  lastfm?: {
    apiKey: string
    apiSecret: string
  }
  spotify?: {
    clientId: string
    clientSecret: string
    redirectUri: string
  }
}

// Initialize settings
export function initSettings(): void {
  try {
    // Ensure the settings directory exists
    if (!fs.existsSync(SETTINGS_DIR)) {
      fs.mkdirSync(SETTINGS_DIR, { recursive: true })
    }

    // Create settings file if it doesn't exist
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(
        SETTINGS_FILE,
        JSON.stringify(
          {
            lastfm: {
              apiKey: process.env.LASTFM_API_KEY || "",
              apiSecret: process.env.LASTFM_API_SECRET || "",
            },
            spotify: {
              clientId: process.env.SPOTIFY_CLIENT_ID || "",
              clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
              redirectUri: process.env.SPOTIFY_REDIRECT_URI || "",
            },
          },
          null,
          2,
        ),
        "utf8",
      )
    }
  } catch (error) {
    console.error("Failed to initialize settings file:", error)
  }
}

// Get settings
export function getSettings(): Settings {
  try {
    // Initialize settings if needed
    initSettings()

    // Read settings from file
    const settingsData = fs.readFileSync(SETTINGS_FILE, "utf8")
    return JSON.parse(settingsData)
  } catch (error) {
    console.error("Error reading settings:", error)
    return {}
  }
}

// Update settings
export function updateSettings(newSettings: Partial<Settings>): boolean {
  try {
    // Initialize settings if needed
    initSettings()

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

    return true
  } catch (error) {
    console.error("Error updating settings:", error)
    return false
  }
}

// Get Last.fm API key
export function getLastfmApiKey(): string {
  const settings = getSettings()
  return settings.lastfm?.apiKey || process.env.LASTFM_API_KEY || ""
}

// Get Last.fm API secret
export function getLastfmApiSecret(): string {
  const settings = getSettings()
  return settings.lastfm?.apiSecret || process.env.LASTFM_API_SECRET || ""
}

// Get Spotify client ID
export function getSpotifyClientId(): string {
  const settings = getSettings()
  return settings.spotify?.clientId || process.env.SPOTIFY_CLIENT_ID || ""
}

// Get Spotify client secret
export function getSpotifyClientSecret(): string {
  const settings = getSettings()
  return settings.spotify?.clientSecret || process.env.SPOTIFY_CLIENT_SECRET || ""
}

// Get Spotify redirect URI
export function getSpotifyRedirectUri(): string {
  const settings = getSettings()
  return settings.spotify?.redirectUri || process.env.SPOTIFY_REDIRECT_URI || ""
}

