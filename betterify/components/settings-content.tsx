"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSpotifyAuthUrl } from "@/lib/spotify"
import { useAppSettings } from "@/hooks/use-app-settings"
import { useUserData } from "@/lib/user-data-context"

export function SettingsContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { userData, saveSpotifyTokens } = useUserData()
  const { settings, updateSettings } = useAppSettings()

  // Spotify credentials state
  const [spotifyClientId, setSpotifyClientId] = useState("")
  const [spotifyClientSecret, setSpotifyClientSecret] = useState("")
  const [isTestingCredentials, setIsTestingCredentials] = useState(false)
  const [credentialsValid, setCredentialsValid] = useState<boolean | null>(null)

  // Piped API settings
  const [pipedApiUrl, setPipedApiUrl] = useState("")
  const [pipedProxyUrl, setPipedProxyUrl] = useState("")
  const [isTestingPiped, setIsTestingPiped] = useState(false)
  const [pipedValid, setPipedValid] = useState<boolean | null>(null)

  // Playback settings
  const [preferredSource, setPreferredSource] = useState("auto")
  const [audioQuality, setAudioQuality] = useState("auto")
  const [videoQuality, setVideoQuality] = useState("720p")
  const [disableVideo, setDisableVideo] = useState(true)

  // UI settings
  const [uiDensity, setUiDensity] = useState("comfortable")
  const [cacheEnabled, setCacheEnabled] = useState(true)
  const [cacheSize, setCacheSize] = useState(100)

  // Handle Spotify auth callback
  useEffect(() => {
    const handleSpotifyCallback = async () => {
      const authSuccess = searchParams.get("auth_success")
      const error = searchParams.get("error")
      const accessToken = searchParams.get("access_token")
      const refreshToken = searchParams.get("refresh_token")
      const expiresIn = searchParams.get("expires_in")

      if (error) {
        toast({
          title: "Authentication Error",
          description: `Failed to connect to Spotify: ${error}`,
          variant: "destructive",
        })
        return
      }

      if (authSuccess && accessToken && refreshToken && expiresIn) {
        try {
          // Save tokens to user data (Clerk) or localStorage
          await saveSpotifyTokens(accessToken, refreshToken, Number.parseInt(expiresIn))

          toast({
            title: "Success",
            description: "Successfully connected to Spotify!",
          })
        } catch (error) {
          console.error("Error saving Spotify tokens:", error)
          toast({
            title: "Error",
            description: "Failed to save Spotify connection.",
            variant: "destructive",
          })
        }
      }
    }

    handleSpotifyCallback()
  }, [searchParams, toast, saveSpotifyTokens])

  // Load saved credentials on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load Spotify credentials
      const savedClientId = localStorage.getItem("spotify_client_id")
      if (savedClientId) setSpotifyClientId(savedClientId)

      // Don't display the secret, just indicate if it's set
      const savedClientSecret = localStorage.getItem("spotify_client_secret")
      if (savedClientSecret) setSpotifyClientSecret("••••••••••••••••••••••••••")

      // Load Piped API settings
      const savedPipedApiUrl = localStorage.getItem("piped_api_url") || process.env.NEXT_PUBLIC_PIPED_API_URL
      if (savedPipedApiUrl) setPipedApiUrl(savedPipedApiUrl)

      const savedPipedProxyUrl = localStorage.getItem("piped_proxy_url") || process.env.NEXT_PUBLIC_PIPED_PROXY_URL
      if (savedPipedProxyUrl) setPipedProxyUrl(savedPipedProxyUrl)
    }
  }, [])

  // Load app settings
  useEffect(() => {
    if (settings) {
      // Playback settings
      setPreferredSource(settings.preferredSource || "auto")
      setAudioQuality(settings.audioQuality || "auto")
      setVideoQuality(settings.videoQuality || "720p")
      setDisableVideo(settings.disableVideo !== undefined ? settings.disableVideo : true)

      // UI settings
      setUiDensity(settings.uiDensity || "comfortable")
      setCacheEnabled(settings.cacheEnabled !== undefined ? settings.cacheEnabled : true)
      setCacheSize(settings.cacheSize || 100)
    }
  }, [settings])

  // Save Spotify credentials
  const saveSpotifyCredentials = () => {
    if (!spotifyClientId || !spotifyClientSecret) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both Client ID and Client Secret.",
        variant: "destructive",
      })
      return
    }

    // Only save if the secret isn't masked
    if (spotifyClientSecret !== "••••••••••••••••••••••••••") {
      localStorage.setItem("spotify_client_id", spotifyClientId)
      localStorage.setItem("spotify_client_secret", spotifyClientSecret)
    } else {
      // Just update the client ID if the secret is masked
      localStorage.setItem("spotify_client_id", spotifyClientId)
    }

    toast({
      title: "Credentials Saved",
      description: "Spotify API credentials have been saved.",
    })
  }

  // Test Spotify credentials
  const testSpotifyCredentials = async () => {
    setIsTestingCredentials(true)
    setCredentialsValid(null)

    try {
      // Only test if we have both credentials
      if (
        !spotifyClientId ||
        spotifyClientSecret === "" ||
        (spotifyClientSecret === "••••••••••••••••••••••••••" && !localStorage.getItem("spotify_client_secret"))
      ) {
        throw new Error("Missing credentials")
      }

      // Use the API endpoint to test credentials
      const response = await fetch("/api/settings/test-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: spotifyClientId,
          clientSecret:
            spotifyClientSecret !== "••••••••••••••••••••••••••"
              ? spotifyClientSecret
              : localStorage.getItem("spotify_client_secret"),
        }),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      setCredentialsValid(true)
      toast({
        title: "Credentials Valid",
        description: "Your Spotify API credentials are working correctly.",
      })
    } catch (error) {
      console.error("Error testing credentials:", error)
      setCredentialsValid(false)
      toast({
        title: "Invalid Credentials",
        description: "Your Spotify API credentials are invalid or missing.",
        variant: "destructive",
      })
    } finally {
      setIsTestingCredentials(false)
    }
  }

  // Connect to Spotify
  const connectToSpotify = () => {
    try {
      // Save credentials first
      if (spotifyClientSecret !== "••••••••••••••••••••••••••") {
        localStorage.setItem("spotify_client_id", spotifyClientId)
        localStorage.setItem("spotify_client_secret", spotifyClientSecret)
      } else if (!localStorage.getItem("spotify_client_secret")) {
        toast({
          title: "Missing Client Secret",
          description: "Please enter your Spotify Client Secret.",
          variant: "destructive",
        })
        return
      }

      // Get the auth URL and redirect
      const authUrl = getSpotifyAuthUrl()
      window.location.href = authUrl
    } catch (error) {
      console.error("Error connecting to Spotify:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to Spotify. Please check your credentials.",
        variant: "destructive",
      })
    }
  }

  // Save Piped API settings
  const savePipedSettings = () => {
    if (!pipedApiUrl || !pipedProxyUrl) {
      toast({
        title: "Missing Settings",
        description: "Please enter both API URL and Proxy URL.",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem("piped_api_url", pipedApiUrl)
    localStorage.setItem("piped_proxy_url", pipedProxyUrl)

    toast({
      title: "Settings Saved",
      description: "Piped API settings have been saved.",
    })
  }

  // Test Piped API
  const testPipedApi = async () => {
    setIsTestingPiped(true)
    setPipedValid(null)

    try {
      // Test the API by making a simple request
      const response = await fetch(`${pipedApiUrl}/config`)

      if (!response.ok) {
        throw new Error("Invalid API URL")
      }

      setPipedValid(true)
      toast({
        title: "API Valid",
        description: "The Piped API is working correctly.",
      })
    } catch (error) {
      console.error("Error testing Piped API:", error)
      setPipedValid(false)
      toast({
        title: "Invalid API",
        description: "The Piped API URL is invalid or the service is down.",
        variant: "destructive",
      })
    } finally {
      setIsTestingPiped(false)
    }
  }

  // Save playback settings
  const savePlaybackSettings = () => {
    updateSettings({
      preferredSource,
      audioQuality,
      videoQuality,
      disableVideo,
      uiDensity,
      cacheEnabled,
      cacheSize,
    })

    toast({
      title: "Settings Saved",
      description: "Your playback settings have been saved.",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="spotify">
        <TabsList className="mb-4">
          <TabsTrigger value="spotify">Spotify</TabsTrigger>
          <TabsTrigger value="piped">Piped API</TabsTrigger>
          <TabsTrigger value="playback">Playback</TabsTrigger>
          <TabsTrigger value="ui">UI & Cache</TabsTrigger>
        </TabsList>

        {/* Spotify Settings */}
        <TabsContent value="spotify">
          <Card>
            <CardHeader>
              <CardTitle>Spotify API Credentials</CardTitle>
              <CardDescription>Enter your Spotify API credentials to enable Spotify integration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input
                  id="client-id"
                  value={spotifyClientId}
                  onChange={(e) => setSpotifyClientId(e.target.value)}
                  placeholder="Enter your Spotify Client ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input
                  id="client-secret"
                  type="password"
                  value={spotifyClientSecret}
                  onChange={(e) => setSpotifyClientSecret(e.target.value)}
                  placeholder={
                    spotifyClientSecret === "••••••••••••••••••••••••••"
                      ? "Already set (enter to change)"
                      : "Enter your Spotify Client Secret"
                  }
                />
              </div>

              {credentialsValid === true && (
                <Alert
                  variant="default"
                  className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Valid Credentials</AlertTitle>
                  <AlertDescription>Your Spotify API credentials are working correctly.</AlertDescription>
                </Alert>
              )}

              {credentialsValid === false && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Invalid Credentials</AlertTitle>
                  <AlertDescription>Your Spotify API credentials are invalid or missing.</AlertDescription>
                </Alert>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>How to get credentials</AlertTitle>
                <AlertDescription>
                  Go to the{" "}
                  <a
                    href="https://developer.spotify.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Spotify Developer Dashboard
                  </a>
                  , create an app, and add{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/api/spotify/callback`
                      : "your-site.com/api/spotify/callback"}
                  </code>{" "}
                  as a redirect URI.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="space-x-2">
                <Button onClick={saveSpotifyCredentials}>Save Credentials</Button>
                <Button variant="outline" onClick={testSpotifyCredentials} disabled={isTestingCredentials}>
                  {isTestingCredentials ? "Testing..." : "Test Credentials"}
                </Button>
              </div>
              <Button onClick={connectToSpotify} disabled={!spotifyClientId}>
                Connect to Spotify
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Piped API Settings */}
        <TabsContent value="piped">
          <Card>
            <CardHeader>
              <CardTitle>Piped API Configuration</CardTitle>
              <CardDescription>Configure the Piped API for music streaming.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="piped-api-url">API URL</Label>
                <Input
                  id="piped-api-url"
                  value={pipedApiUrl}
                  onChange={(e) => setPipedApiUrl(e.target.value)}
                  placeholder="https://pipedapi.kavin.rocks"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="piped-proxy-url">Proxy URL</Label>
                <Input
                  id="piped-proxy-url"
                  value={pipedProxyUrl}
                  onChange={(e) => setPipedProxyUrl(e.target.value)}
                  placeholder="https://pipedproxy.kavin.rocks"
                />
              </div>

              {pipedValid === true && (
                <Alert
                  variant="default"
                  className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Valid API</AlertTitle>
                  <AlertDescription>The Piped API is working correctly.</AlertDescription>
                </Alert>
              )}

              {pipedValid === false && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Invalid API</AlertTitle>
                  <AlertDescription>The Piped API URL is invalid or the service is down.</AlertDescription>
                </Alert>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>About Piped API</AlertTitle>
                <AlertDescription>
                  Piped is an alternative frontend for YouTube that provides a privacy-friendly way to access content.
                  You can use the public instance or{" "}
                  <a
                    href="https://github.com/TeamPiped/Piped"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    host your own
                  </a>
                  .
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={savePipedSettings}>Save Settings</Button>
              <Button variant="outline" onClick={testPipedApi} disabled={isTestingPiped}>
                {isTestingPiped ? "Testing..." : "Test API"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Playback Settings */}
        <TabsContent value="playback">
          <Card>
            <CardHeader>
              <CardTitle>Playback Settings</CardTitle>
              <CardDescription>Configure how music and videos are played.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferred-source">Preferred Music Source</Label>
                <select
                  id="preferred-source"
                  value={preferredSource}
                  onChange={(e) => setPreferredSource(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                >
                  <option value="auto">Auto (Try Spotify, fallback to Piped)</option>
                  <option value="spotify">Spotify (When Available)</option>
                  <option value="piped">Piped (YouTube)</option>
                  <option value="lastfm">Last.fm</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio-quality">Audio Quality</Label>
                <select
                  id="audio-quality"
                  value={audioQuality}
                  onChange={(e) => setAudioQuality(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                >
                  <option value="auto">Auto (Based on connection)</option>
                  <option value="low">Low (64kbps)</option>
                  <option value="medium">Medium (128kbps)</option>
                  <option value="high">High (256kbps)</option>
                  <option value="best">Best (320kbps when available)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-quality">Video Quality (Piped)</Label>
                <select
                  id="video-quality"
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                >
                  <option value="144p">144p</option>
                  <option value="240p">240p</option>
                  <option value="360p">360p</option>
                  <option value="480p">480p</option>
                  <option value="720p">720p (Recommended)</option>
                  <option value="1080p">1080p</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="disable-video" checked={disableVideo} onCheckedChange={setDisableVideo} />
                <Label htmlFor="disable-video">Disable Video (Audio Only)</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePlaybackSettings}>Save Playback Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* UI & Cache Settings */}
        <TabsContent value="ui">
          <Card>
            <CardHeader>
              <CardTitle>UI & Cache Settings</CardTitle>
              <CardDescription>Configure the user interface and caching behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ui-density">UI Density</Label>
                <select
                  id="ui-density"
                  value={uiDensity}
                  onChange={(e) => setUiDensity(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                >
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                  <option value="cozy">Cozy</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="cache-enabled" checked={cacheEnabled} onCheckedChange={setCacheEnabled} />
                <Label htmlFor="cache-enabled">Enable Caching</Label>
              </div>

              {cacheEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="cache-size">Cache Size (MB)</Label>
                  <Input
                    id="cache-size"
                    type="number"
                    min="10"
                    max="1000"
                    value={cacheSize}
                    onChange={(e) => setCacheSize(Number.parseInt(e.target.value))}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={savePlaybackSettings}>Save UI Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

