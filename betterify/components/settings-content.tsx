"use client"

import { useState, useEffect } from "react"
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

// Replace these with your actual Spotify API credentials
const HARDCODED_CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID_HERE"
const HARDCODED_CLIENT_SECRET = "YOUR_SPOTIFY_CLIENT_SECRET_HERE"

export function SettingsContent() {
  const [clientId, setClientId] = useState(HARDCODED_CLIENT_ID)
  const [clientSecret, setClientSecret] = useState(HARDCODED_CLIENT_SECRET)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

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
    if (authSuccess && accessToken && refreshToken && expiresIn) {
      // Save the tokens
      localStorage.setItem("spotify_access_token", accessToken)
      localStorage.setItem("spotify_refresh_token", refreshToken)
      localStorage.setItem("spotify_token_expiry", (Date.now() + Number(expiresIn) * 1000).toString())

      // Clear the URL parameters
      router.replace("/settings")

      toast({
        title: "Connected to Spotify",
        description: "Your Spotify account has been successfully connected.",
      })

      // Update the connection status
      setIsConnectedToSpotify(true)
    } else if (authError) {
      toast({
        title: "Authentication Error",
        description: `Failed to connect to Spotify: ${authError}`,
        variant: "destructive",
      })
    }
  }, [authSuccess, accessToken, refreshToken, expiresIn, authError, router, toast])

  // Add a function to check if the user is logged in to Spotify
  const [isConnectedToSpotify, setIsConnectedToSpotify] = useState(false)

  useEffect(() => {
    const checkSpotifyConnection = () => {
      const token = localStorage.getItem("spotify_access_token")
      const expiry = localStorage.getItem("spotify_token_expiry")

      if (token && expiry && Number(expiry) > Date.now()) {
        setIsConnectedToSpotify(true)
      } else {
        setIsConnectedToSpotify(false)
      }
    }

    // Check on component mount
    checkSpotifyConnection()

    // Set up interval to periodically check token validity
    const connectionCheckInterval = setInterval(checkSpotifyConnection, 60000)

    return () => clearInterval(connectionCheckInterval)
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
    localStorage.removeItem("spotify_access_token")
    localStorage.removeItem("spotify_refresh_token")
    localStorage.removeItem("spotify_token_expiry")
    setIsConnectedToSpotify(false)

    toast({
      title: "Disconnected from Spotify",
      description: "Your Spotify account has been disconnected.",
    })
  }

  // Add a function to connect to Spotify
  const connectToSpotify = () => {
    try {
      const authUrl = getSpotifyAuthUrl()
      window.location.href = authUrl
    } catch (error) {
      console.error("Error generating Spotify auth URL:", error)
      toast({
        title: "Error",
        description: "There was a problem connecting to Spotify. Make sure you've saved your Client ID.",
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
                  placeholder="http://localhost:8080"
                  value={process.env.NEXT_PUBLIC_PIPED_API_URL || "http://localhost:8080"}
                  disabled
                />
                <p className="text-xs text-neutral-500">
                  To change this, update the NEXT_PUBLIC_PIPED_API_URL in your .env.local file
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="piped-proxy">Piped Proxy URL</Label>
                <Input
                  id="piped-proxy"
                  placeholder="http://localhost:8081"
                  value={process.env.NEXT_PUBLIC_PIPED_PROXY_URL || "http://localhost:8081"}
                  disabled
                />
                <p className="text-xs text-neutral-500">
                  To change this, update the NEXT_PUBLIC_PIPED_PROXY_URL in your .env.local file
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
                  <div className="p-3 rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Your Spotify account is connected. You can now see your personal playlists in the sidebar.
                  </div>
                ) : (
                  <div className="p-3 rounded-md bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                    Connect your Spotify account to access your personal playlists and recommendations.
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {isConnectedToSpotify ? (
                <Button variant="destructive" onClick={disconnectSpotify}>
                  Disconnect from Spotify
                </Button>
              ) : (
                <Button onClick={connectToSpotify} disabled={!clientId}>
                  Connect to Spotify
                </Button>
              )}
            </CardFooter>
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

