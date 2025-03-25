"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Music, Download, Settings, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeSelector } from "@/components/theme-selector"
import { useIsMobile } from "@/hooks/use-mobile"
import { signIn, signOut, useSession } from "next-auth/react"
import { usePlaylists } from "@/hooks/use-playlists"

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { data: session } = useSession()
  const { playlists } = usePlaylists()
  const [likedSongs, setLikedSongs] = useState<any[]>([])

  useEffect(() => {
    // Load liked songs from localStorage
    try {
      const storedLikedSongs = localStorage.getItem("liked_songs")
      if (storedLikedSongs) {
        setLikedSongs(JSON.parse(storedLikedSongs))
      }
    } catch (error) {
      console.error("Error loading liked songs:", error)
    }

    // Listen for storage events to update liked songs when changed
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "liked_songs") {
        try {
          const updatedLikedSongs = e.newValue ? JSON.parse(e.newValue) : []
          setLikedSongs(updatedLikedSongs)
        } catch (error) {
          console.error("Error parsing liked songs:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <Music className="h-6 w-6 theme-text" />
          <h1 className="text-xl font-bold">Music App</h1>
        </div>
        <div className="space-y-1">
          <Button variant={isActive("/") ? "secondary" : "ghost"} size="sm" className="w-full justify-start" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button
            variant={isActive("/search") ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Link>
          </Button>
          <Button
            variant={isActive("/local-media") ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/local-media">
              <Download className="mr-2 h-4 w-4" />
              Local Media
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Library</h2>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-1">
              <Button
                variant={pathname === "/playlist/liked" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link href="/playlist/liked">
                  <Music className="mr-2 h-4 w-4" />
                  Liked Songs
                  <span className="ml-auto text-xs">{likedSongs.length}</span>
                </Link>
              </Button>

              <h3 className="mb-2 mt-4 px-2 text-sm font-semibold">Your Playlists</h3>
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <Button
                    key={playlist.id}
                    variant={pathname === `/playlist/${playlist.id}` ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/playlist/${playlist.id}`}>
                      <Music className="mr-2 h-4 w-4" />
                      {playlist.name}
                      <span className="ml-auto text-xs">{playlist.songs?.length || 0}</span>
                    </Link>
                  </Button>
                ))
              ) : (
                <p className="px-2 text-xs text-muted-foreground">No playlists yet</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <div className="flex items-center justify-between mb-2">
          <ThemeToggle />
          <ThemeSelector />
        </div>
        <Button
          variant={isActive("/settings") ? "secondary" : "ghost"}
          size="sm"
          className="w-full justify-start"
          asChild
        >
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
        {session ? (
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => signIn()}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>
    </div>
  )
}

