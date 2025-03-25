"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface UserData {
  spotifyToken?: string
  spotifyRefreshToken?: string
  spotifyTokenExpiry?: number
  playlists?: any[]
  settings?: Record<string, any>
}

interface UserDataContextType {
  userData: UserData
  isLoading: boolean
  saveSpotifyTokens: (accessToken: string, refreshToken: string, expiresIn: number) => Promise<void>
  savePlaylists: (playlists: any[]) => Promise<void>
  saveSettings: (settings: Record<string, any>) => Promise<void>
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData>({})
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load user data when session is loaded
  useEffect(() => {
    async function loadUserData() {
      if (status === "loading") {
        // Still loading session, don't do anything yet
        return
      }

      if (status === "unauthenticated") {
        // User is not signed in, we can stop loading
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        // In a real app, you would fetch user data from your API
        // For now, we'll just use localStorage as a fallback
        const storedData = localStorage.getItem("user_data")
        if (storedData) {
          setUserData(JSON.parse(storedData))
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        toast({
          title: "Error",
          description: "Failed to load your data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [status, toast])

  // Save Spotify tokens
  const saveSpotifyTokens = async (accessToken: string, refreshToken: string, expiresIn: number) => {
    try {
      // Calculate expiry timestamp
      const expiryTimestamp = Date.now() + expiresIn * 1000

      // Update local state
      setUserData((prev) => ({
        ...prev,
        spotifyToken: accessToken,
        spotifyRefreshToken: refreshToken,
        spotifyTokenExpiry: expiryTimestamp,
      }))

      // In a real app, you would save this to your database
      // For now, we'll just use localStorage
      const updatedData = {
        ...userData,
        spotifyToken: accessToken,
        spotifyRefreshToken: refreshToken,
        spotifyTokenExpiry: expiryTimestamp,
      }
      localStorage.setItem("user_data", JSON.stringify(updatedData))

      toast({
        title: "Success",
        description: "Spotify connection saved to your account.",
      })
    } catch (error) {
      console.error("Error saving Spotify tokens:", error)
      toast({
        title: "Error",
        description: "Failed to save Spotify connection. Please try again.",
        variant: "destructive",
      })

      // Fallback to localStorage
      localStorage.setItem("spotify_access_token", accessToken)
      localStorage.setItem("spotify_refresh_token", refreshToken)
      localStorage.setItem("spotify_token_expiry", (Date.now() + expiresIn * 1000).toString())
    }
  }

  // Save playlists
  const savePlaylists = async (playlists: any[]) => {
    try {
      // Update local state
      setUserData((prev) => ({
        ...prev,
        playlists,
      }))

      // In a real app, you would save this to your database
      // For now, we'll just use localStorage
      const updatedData = {
        ...userData,
        playlists,
      }
      localStorage.setItem("user_data", JSON.stringify(updatedData))
    } catch (error) {
      console.error("Error saving playlists:", error)
      toast({
        title: "Error",
        description: "Failed to save playlists to your account. Using local storage instead.",
        variant: "destructive",
      })

      // Fallback to localStorage
      localStorage.setItem("user_playlists", JSON.stringify(playlists))
    }
  }

  // Save settings
  const saveSettings = async (settings: Record<string, any>) => {
    try {
      // Update local state
      setUserData((prev) => ({
        ...prev,
        settings,
      }))

      // In a real app, you would save this to your database
      // For now, we'll just use localStorage
      const updatedData = {
        ...userData,
        settings,
      }
      localStorage.setItem("user_data", JSON.stringify(updatedData))
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings to your account. Using local storage instead.",
        variant: "destructive",
      })

      // Fallback to localStorage
      localStorage.setItem("app_settings", JSON.stringify(settings))
    }
  }

  return (
    <UserDataContext.Provider
      value={{
        userData,
        isLoading,
        saveSpotifyTokens,
        savePlaylists,
        saveSettings,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

// Update the useUserData function to safely handle cases where the context doesn't exist
export function useUserData() {
  const context = useContext(UserDataContext)

  // Return a fallback context if used outside the provider (better than crashing)
  if (context === undefined) {
    // For client components only, show a warning in dev
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      console.warn("useUserData must be used within a UserDataProvider")
    }

    // Return a minimal implementation that won't crash
    return {
      userData: {},
      isLoading: false,
      saveSpotifyTokens: async () => {},
      savePlaylists: async () => {},
      saveSettings: async () => {},
    }
  }

  return context
}

