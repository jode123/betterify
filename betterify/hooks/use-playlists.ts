"use client"

import { useState, useEffect } from "react"

interface Playlist {
  id: string
  name: string
  description?: string
  songs: any[]
}

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  useEffect(() => {
    // Load playlists from localStorage
    const loadPlaylists = () => {
      try {
        const storedPlaylists = localStorage.getItem("user_playlists")
        if (storedPlaylists) {
          setPlaylists(JSON.parse(storedPlaylists))
        } else {
          // Initialize with empty array if no playlists exist
          setPlaylists([])
        }
      } catch (error) {
        console.error("Error loading playlists:", error)
        setPlaylists([])
      }
    }

    loadPlaylists()

    // Listen for storage events to update playlists when changed in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_playlists") {
        loadPlaylists()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return { playlists }
}

