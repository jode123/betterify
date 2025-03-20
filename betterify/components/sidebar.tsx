"use client"

import { Home, Search, Library, PlusCircle, Settings, Menu, X, LogOut, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeSelector } from "@/components/theme-selector"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const { themeColor } = useTheme()
  const { toast } = useToast()
  const [spotifyUser, setSpotifyUser] = useState<{ display_name: string; images?: { url: string }[] } | null>(null)

  // Mock playlists - in a real app, these would come from the Spotify API
  const playlists = [
    { id: "37i9dQZF1DX0XUsuxWHRQd", name: "Chill Vibes" },
    { id: "37i9dQZF1DX76Wlfdnj7AP", name: "Beast Mode" },
    { id: "37i9dQZF1DXcBWIGoYBM5M", name: "Today's Top Hits" },
    { id: "37i9dQZF1DX4JAvHpjipBk", name: "New Music Friday" },
    { id: "37i9dQZF1DX1lVhptIYRda", name: "Hot Hits USA" },
  ]

  // State for user playlists
  const [userPlaylists, setUserPlaylists] = useState<Array<{ id: string; name: string }>>([])
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("spotify_access_token")
      const tokenExpiry = localStorage.getItem("spotify_token_expiry")

      if (accessToken && tokenExpiry && Number(tokenExpiry) > Date.now()) {
        setIsAuthenticated(true)
        fetchSpotifyUser(accessToken)
        return true
      }
      setIsAuthenticated(false)
      setSpotifyUser(null)
      return false
    }

    // Initial check
    const isAuth = checkAuth()

    // Set up a timer to check periodically (every minute)
    const authCheckInterval = setInterval(() => {
      checkAuth()
    }, 60000)

    return () => clearInterval(authCheckInterval)
  }, [])

  // Fetch Spotify user profile
  const fetchSpotifyUser = async (accessToken: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setSpotifyUser(userData)
      }
    } catch (error) {
      console.error("Error fetching Spotify user:", error)
    }
  }

  // Effect to fetch user playlists if authenticated
  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (!isAuthenticated) {
        return
      }

      const accessToken = localStorage.getItem("spotify_access_token")
      if (!accessToken) return

      try {
        setIsLoadingPlaylists(true)
        const response = await fetch(`/api/spotify/user-playlists?access_token=${accessToken}`)

        if (!response.ok) {
          throw new Error("Failed to fetch playlists")
        }

        const data = await response.json()
        setUserPlaylists(data)
      } catch (error) {
        console.error("Error fetching user playlists:", error)
      } finally {
        setIsLoadingPlaylists(false)
      }
    }

    fetchUserPlaylists()
  }, [isAuthenticated])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    }
  }, [pathname, isMobile])

  // Always show sidebar on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [isMobile])

  // Handle disconnect from Spotify
  const handleDisconnect = () => {
    localStorage.removeItem("spotify_access_token")
    localStorage.removeItem("spotify_refresh_token")
    localStorage.removeItem("spotify_token_expiry")
    setIsAuthenticated(false)
    setSpotifyUser(null)
    setUserPlaylists([])

    toast({
      title: "Disconnected from Spotify",
      description: "You have been successfully logged out of Spotify.",
    })
  }

  const sidebarContent = (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold theme-text">Music App</h1>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </Button>
          )}
        </div>
        <nav className="space-y-4">
          <Link
            href="/"
            className={cn(
              "flex items-center space-x-3 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white theme-glow-hover p-2 rounded-md",
              pathname === "/" && "text-black dark:text-white font-medium theme-text",
            )}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            href="/search"
            className={cn(
              "flex items-center space-x-3 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white theme-glow-hover p-2 rounded-md",
              pathname === "/search" && "text-black dark:text-white font-medium theme-text",
            )}
          >
            <Search size={20} />
            <span>Search</span>
          </Link>
          <div className={cn("flex items-center space-x-3 text-neutral-700 dark:text-neutral-300 p-2 rounded-md")}>
            <Library size={20} />
            <span>Your Library</span>
          </div>
          <Link
            href="/settings"
            className={cn(
              "flex items-center space-x-3 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white theme-glow-hover p-2 rounded-md",
              pathname === "/settings" && "text-black dark:text-white font-medium theme-text",
            )}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      <div className="mt-4 px-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1 text-neutral-700 dark:text-neutral-300">
            <PlusCircle size={18} />
            <span className="text-sm">New Playlist</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-2 mt-2">
          {isLoadingPlaylists ? (
            <div className="text-sm text-neutral-500">Loading playlists...</div>
          ) : userPlaylists.length > 0 ? (
            <>
              <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 pt-4 pb-2">Your Playlists</div>
              {userPlaylists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  className={cn(
                    "block py-2 px-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white truncate theme-glow-hover rounded-md",
                    pathname === `/playlist/${playlist.id}` && "text-black dark:text-white font-medium theme-text",
                  )}
                >
                  {playlist.name}
                </Link>
              ))}
              <div className="border-t border-neutral-200 dark:border-neutral-700 my-4"></div>
            </>
          ) : null}

          <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 pt-2 pb-2">Featured Playlists</div>
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className={cn(
                "block py-2 px-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white truncate theme-glow-hover rounded-md",
                pathname === `/playlist/${playlist.id}` && "text-black dark:text-white font-medium theme-text",
              )}
            >
              {playlist.name}
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="p-6 mt-auto">
        <div className="flex items-center justify-between mb-4">
          <ThemeSelector />

          {isAuthenticated && spotifyUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDisconnect}
              className="theme-glow-hover"
              title="Disconnect from Spotify"
            >
              <LogOut size={20} />
            </Button>
          )}
        </div>

        {isAuthenticated && spotifyUser && (
          <div className="flex items-center space-x-2 p-2 rounded-md bg-neutral-200 dark:bg-neutral-700 theme-glow-hover">
            <Avatar className="h-8 w-8">
              <AvatarImage src={spotifyUser.images?.[0]?.url} />
              <AvatarFallback>
                <User size={16} />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium truncate">{spotifyUser.display_name}</div>
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-neutral-100 dark:bg-neutral-800 shadow-md theme-glow-hover"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-neutral-100 dark:bg-neutral-800 flex flex-col h-full transition-all duration-300",
          isMobile ? "fixed inset-y-0 left-0 z-50 w-72 shadow-xl" : "w-72",
          isMobile && !isOpen && "-translate-x-full",
        )}
      >
        {sidebarContent}
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}
    </>
  )
}

