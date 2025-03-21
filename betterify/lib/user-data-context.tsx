"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
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
  const { user, isLoaded, isSignedIn } = useUser()
  const [userData, setUserData] = useState<UserData>({})
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load user data when user is loaded and signed in
  useEffect(() => {
    async function loadUserData() {
      if (!isLoaded) {
        // Still loading Clerk, don't do anything yet
        return
      }

      if (!isSignedIn) {
        // User is not signed in, we can stop loading
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        // Get user's public metadata
        const publicMetadata = (user?.publicMetadata as UserData) || {}

        // Set user data from metadata
        setUserData(publicMetadata)
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
  }, [isLoaded, isSignedIn, user, toast])

  // Save Spotify tokens to user metadata
  const saveSpotifyTokens = async (accessToken: string, refreshToken: string, expiresIn: number) => {
    if (!isSignedIn || !user) {
      // If not signed in, save to localStorage as fallback
      localStorage.setItem("spotify_access_token", accessToken)
      localStorage.setItem("spotify_refresh_token", refreshToken)
      localStorage.setItem("spotify_token_expiry", (Date.now() + expiresIn * 1000).toString())
      return
    }

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

      // Update user metadata
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          spotifyToken: accessToken,
          spotifyRefreshToken: refreshToken,
          spotifyTokenExpiry: expiryTimestamp,
        },
      })

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

  // Save playlists to user metadata
  const savePlaylists = async (playlists: any[]) => {
    if (!isSignedIn || !user) {
      // If not signed in, save to localStorage as fallback
      localStorage.setItem("user_playlists", JSON.stringify(playlists))
      return
    }

    try {
      // Update local state
      setUserData((prev) => ({
        ...prev,
        playlists,
      }))

      // Update user metadata
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          playlists,
        },
      })
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

  // Save settings to user metadata
  const saveSettings = async (settings: Record<string, any>) => {
    if (!isSignedIn || !user) {
      // If not signed in, save to localStorage as fallback
      localStorage.setItem("app_settings", JSON.stringify(settings))
      return
    }

    try {
      // Update local state
      setUserData((prev) => ({
        ...prev,
        settings,
      }))

      // Update user metadata
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          settings,
        },
      })
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

