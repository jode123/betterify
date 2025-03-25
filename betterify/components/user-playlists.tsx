"use client"

import { useEffect, useState } from "react"
import { getPlaylists, type Playlist } from "@/lib/playlist-manager"
import { useUserData } from "@/lib/user-data-context"

export function useUserPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const userData = useUserData()

  useEffect(() => {
    // Try to get playlists from user data first
    if (userData?.userData?.playlists) {
      setPlaylists(userData.userData.playlists)
    } else {
      // Fall back to local storage
      setPlaylists(getPlaylists())
    }
  }, [userData])

  const savePlaylists = async (newPlaylists: Playlist[]) => {
    setPlaylists(newPlaylists)

    // Try to save to user data context first
    if (userData && userData.savePlaylists) {
      await userData.savePlaylists(newPlaylists)
    } else {
      // Fall back to localStorage
      localStorage.setItem("user_playlists", JSON.stringify(newPlaylists))
    }
  }

  return { playlists, savePlaylists }
}

