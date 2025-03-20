"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Moon, Sun, Save, RefreshCw } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { getSpotifyAuthUrl } from "@/lib/spotify"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaylistManager } from "@/components/playlist-manager"
import { isSpotifyAuthenticated } from '@/lib/auth'

// Replace these with your actual Spotify API credentials
const HARDCODED_CLIENT_ID = "f386c406d93949f5b0e886d55e70804e"
const HARDCODED_CLIENT_SECRET = "0b15b2f8af744fdc89a354f2d4c333c3"

const SettingsContent = () => {
  const [clientId, setClientId] = useState(HARDCODED_CLIENT_ID)
  const [clientSecret, setClientSecret] = useState(HARDCODED_CLIENT_SECRET)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isConnectedToSpotify, setIsConnectedToSpotify] = useState(false)
  const [spotifyUsername, setSpotifyUsername] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse authentication results
  const authSuccess = searchParams.get("auth_success") === "true"
  const accessToken = searchParams.get("access_token")
  const refreshToken = searchParams.get("refresh_token")
  const expiresIn = searchParams.get("expires_in")
  const authError = searchParams.get("error")

  // Save tokens if we received them from the callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authSuccess = params.get("auth_success") === "true"
    const error = params.get("error")

    if (authSuccess) {
      // Add delay to ensure cookies are set
      setTimeout(() => {
        fetchSpotifyUser()
        router.replace('/settings')
        
        toast({
          title: "Successfully Connected! 🎉",
          description: "Your Spotify account is now linked.",
          variant: "default",
          duration: 5000,
        })
      }, 1000)
    } else if (error) {
      setIsConnectedToSpotify(false)
      setSpotifyUsername(null)
      
      toast({
        title: "Authentication Failed",
        description: `Could not connect to Spotify: ${error}`,
        variant: "destructive",
        duration: 5000,
      })
    }
  }, [router, toast])

  // Add a function to check if the user is logged in to Spotify
  const fetchSpotifyUser = async () => {
    try {
      const cookies = document.cookie.split(';').map(c => c.trim())
      const accessToken = cookies
        .find(c => c.startsWith('spotify_access_token='))
        ?.split('=')[1]

      if (!accessToken) {
        console.log('No access token found') // Debug log
        setIsConnectedToSpotify(false)
        setSpotifyUsername(null)
        return
      }

      console.log('Fetching user profile...') // Debug log

      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('User profile:', data) // Debug log
        setSpotifyUsername(data.display_name || data.id)
        setIsConnectedToSpotify(true)
      } else {
        throw new Error(`Failed to fetch user profile: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching Spotify user:', error)
      setIsConnectedToSpotify(false)
      setSpotifyUsername(null)
    }
  }

  // Combine auth checking effects into one
  useEffect(() => {
    const checkSpotifyAuth = async () => {
      // Check cookies directly
      const cookies = document.cookie.split(';').map(c => c.trim())
      const hasAccessToken = cookies.some(c => c.startsWith('spotify_access_token='))
      const hasTokenExpiry = cookies.some(c => c.startsWith('spotify_token_expiry='))
      
      console.log('Auth check:', { hasAccessToken, hasTokenExpiry }) // Debug log

      if (hasAccessToken && hasTokenExpiry) {
        setIsConnectedToSpotify(true)
        // Fetch user profile if we have a token
        await fetchSpotifyUser()
      } else {
        setIsConnectedToSpotify(false)
        setSpotifyUsername(null)
      }
    }

    // Check immediately
    checkSpotifyAuth()

    // Add interval to check every 30 seconds
    const interval = setInterval(checkSpotifyAuth, 30000)

    // Check when window gains focus
    window.addEventListener('focus', checkSpotifyAuth)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', checkSpotifyAuth)
    }
  }, [])

  // Load saved credentials on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedClientId = localStorage.getItem("spotify_client_id")
      const savedClientSecret = localStorage.getItem("spotify_client_secret")

      if (savedClientId) setClientId(savedClientId)
      if (savedClientSecret) setClientSecret(savedClientSecret)
    }
  }, [])

  const saveCredentials = async () => {
    try {
      setIsSaving(true)

      // Save to localStorage
      localStorage.setItem("spotify_client_id", clientId)
      localStorage.setItem("spotify_client_secret", clientSecret)

      // Save to server (this would update environment variables in a real app)
      const response = await fetch("/api/settings/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId, clientSecret }),
      })

      if (!response.ok) {
        throw new Error("Failed to save credentials")
      }

      toast({
        title: "Settings saved",
        description: "Your Spotify API credentials have been saved.",
      })
    } catch (error) {
      console.error("Error saving credentials:", error)
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const testCredentials = async () => {
    try {
      setIsTesting(true)
      setTestResult(null)

      const response = await fetch("/api/settings/test-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId, clientSecret }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to test credentials")
      }

      setTestResult({
        success: true,
        message: "Connection successful! Your credentials are working.",
      })
    } catch (error) {
      console.error("Error testing credentials:", error)
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to test credentials",
      })
    } finally {
      setIsTesting(false)
    }
  }

  // Add a function to disconnect from Spotify
  const disconnectSpotify = () => {
    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim()
      if (name.startsWith('spotify_')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=lax`
      }
    })

    // Update state
    setIsConnectedToSpotify(false)
    setSpotifyUsername(null)

    toast({
      title: "Disconnected from Spotify",
      description: "Your Spotify account has been disconnected.",
      variant: "default",
    })

    // Force a page refresh to clear any cached states
    router.refresh()
  }

  // Add a function to connect to Spotify
  const connectToSpotify = () => {
    try {
      // Clear any existing Spotify-related cookies
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim()
        if (name.startsWith('spotify_')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=lax`
        }
      })

      // Clear localStorage
      localStorage.removeItem("spotify_access_token")
      localStorage.removeItem("spotify_refresh_token")
      localStorage.removeItem("spotify_token_expiry")
      localStorage.removeItem("spotify_auth_state")

      // Construct Spotify auth URL
      const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private',
        redirect_uri: 'https://betterify.vercel.app/api/spotify/callback',
        show_dialog: 'true' // Forces user to approve the app again
      }).toString()}`

      // Redirect to Spotify auth page
      window.location.href = authUrl
    } catch (error) {
      console.error("Error connecting to Spotify:", error)
      toast({
        title: "Error",
        description: "There was a problem connecting to Spotify. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-8">Settings</h2>

      <Tabs defaultValue="general" className="max-w-3xl">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="spotify">Spotify</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Switch between light and dark themes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                  <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                  <Moon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Piped Configuration</CardTitle>
              <CardDescription>Configure the Piped backend and proxy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="piped-api">Piped API URL</Label>
                <Input
                  id="piped-api"
                  value={process.env.NEXT_PUBLIC_PIPED_API_URL || "https://pipedapi.kavin.rocks"}
                  disabled
                />
                <p className="text-xs text-neutral-500">
                  Using public Piped instance for production
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="piped-proxy">Piped Proxy URL</Label>
                <Input
                  id="piped-proxy"
                  value={process.env.NEXT_PUBLIC_PIPED_PROXY_URL || "https://pipedproxy.kavin.rocks"}
                  disabled
                />
                <p className="text-xs text-neutral-500">
                  Using public Piped proxy for production
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-neutral-500">
                Make sure the Piped Docker containers are running. Check the README for instructions.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="spotify" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Spotify API Credentials</CardTitle>
              <CardDescription>Your Spotify API credentials are pre-filled for convenience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input
                  id="client-id"
                  placeholder="Enter your Spotify Client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input
                  id="client-secret"
                  type="password"
                  placeholder="Enter your Spotify Client Secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-md ${
                    testResult.success
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {testResult.message}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={testCredentials} disabled={!clientId || !clientSecret || isTesting}>
                {isTesting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
              <Button onClick={saveCredentials} disabled={!clientId || !clientSecret || isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Credentials
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connect to Spotify</CardTitle>
              <CardDescription>Connect your Spotify account to access your personal playlists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isConnectedToSpotify ? (
                  <div className="flex flex-col gap-4">
                    <div 
                      className="flex items-center gap-3 p-4 rounded-lg bg-green-100 dark:bg-green-900/30"
                      key={`connected-${spotifyUsername}`} // Force re-render on username change
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800 dark:text-green-400">
                          Connected to Spotify
                        </h4>
                        {spotifyUsername && (
                          <p className="text-sm text-green-700 dark:text-green-500">
                            Logged in as {spotifyUsername}
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={disconnectSpotify}
                        className="shrink-0"
                      >
                        Disconnect
                      </Button>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Your Spotify account is connected. You can now access your playlists.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <h4 className="font-medium text-neutral-800 dark:text-neutral-200">
                        Not Connected
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Connect your Spotify account to access your playlists.
                      </p>
                    </div>
                    <Button 
                      onClick={connectToSpotify} 
                      disabled={!clientId}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      Connect to Spotify
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Manage Playlists</CardTitle>
              <CardDescription>Create, edit, and delete your playlists</CardDescription>
            </CardHeader>
            <CardContent>
              <PlaylistManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Create the main page component
export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  )
}

