"use client"

import {
  Home,
  Search,
  Library,
  PlusCircle,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
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
import { UserAuthButton } from "@/components/user-auth-button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getFeaturedPlaylists } from "@/lib/spotify"
import { useUserData } from "@/lib/user-data-context"

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const { themeColor } = useTheme()
  const { toast } = useToast()
  const [spotifyUser, setSpotifyUser] = useState<{ display_name: string; images?: { url: string }[] } | null>(null)
  const { userData } = useUserData()

  // State for playlists
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Array<{ id: string; name: string }>>([])
  const [userPlaylists, setUserPlaylists] = useState<Array<{ id: string; name: string }>>([])
  const [localPlaylists, setLocalPlaylists] = useState<Array<{ id: string; name: string }>>([])
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Collapsible state
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(true)
  const [isUserPlaylistsOpen, setIsUserPlaylistsOpen] = useState(true)
  const [isLocalPlaylistsOpen, setIsLocalPlaylistsOpen] = useState(true)

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

  // Effect to fetch featured playlists
  useEffect(() => {
    const fetchFeaturedPlaylists = async () => {
      try {
        setIsLoadingPlaylists(true)
        const playlists = await getFeaturedPlaylists()
        setFeaturedPlaylists(playlists)
      } catch (error) {
        console.error("Error fetching featured playlists:", error)
      } finally {
        setIsLoadingPlaylists(false)
      }
    }

    fetchFeaturedPlaylists()
  }, [])

  // Effect to load local playlists
  useEffect(() => {
    const loadLocalPlaylists = () => {
      try {
        // Try to get from userData first (Clerk)
        if (userData.playlists) {
          setLocalPlaylists(userData.playlists)
          return
        }

        // Fall back to localStorage
        const savedPlaylists = localStorage.getItem("user_playlists")
        if (savedPlaylists) {
          setLocalPlaylists(JSON.parse(savedPlaylists))
        }
      } catch (error) {
        console.error("Error loading local playlists:", error)
      }
    }

    loadLocalPlaylists()
  }, [userData])

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
          {/* Local Playlists Section */}
          {localPlaylists.length > 0 && (
            <Collapsible open={isLocalPlaylistsOpen} onOpenChange={setIsLocalPlaylistsOpen} className="space-y-2">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer py-2">
                  <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Your Created Playlists
                  </span>
                  {isLocalPlaylistsOpen ? (
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-neutral-500" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                {localPlaylists.map((playlist) => (
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
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Spotify User Playlists Section */}
          {isLoadingPlaylists ? (
            <div className="text-sm text-neutral-500">Loading playlists...</div>
          ) : userPlaylists.length > 0 ? (
            <Collapsible open={isUserPlaylistsOpen} onOpenChange={setIsUserPlaylistsOpen} className="space-y-2">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer py-2">
                  <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Your Spotify Playlists
                  </span>
                  {isUserPlaylistsOpen ? (
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-neutral-500" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
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
              </CollapsibleContent>
            </Collapsible>
          ) : null}

          {/* Featured Playlists Section */}
          {featuredPlaylists.length > 0 && (
            <Collapsible open={isFeaturedOpen} onOpenChange={setIsFeaturedOpen} className="space-y-2">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer py-2">
                  <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Featured Playlists</span>
                  {isFeaturedOpen ? (
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-neutral-500" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                {featuredPlaylists.map((playlist) => (
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
              </CollapsibleContent>
            </Collapsible>
          )}
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

        <div className="flex items-center justify-between">
          <UserAuthButton />

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

