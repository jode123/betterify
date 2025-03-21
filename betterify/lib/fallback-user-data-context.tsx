"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Create a simplified version of the user data context
interface SimpleUserData {
  [key: string]: any
}

interface SimpleUserDataContextType {
  userData: SimpleUserData
  isLoading: boolean
  saveSpotifyTokens: (accessToken: string, refreshToken: string, expiresIn: number) => Promise<void>
  savePlaylists: (playlists: any[]) => Promise<void>
  saveSettings: (settings: Record<string, any>) => Promise<void>
}

const SimpleUserDataContext = createContext<SimpleUserDataContextType>({
  userData: {},
  isLoading: false,
  saveSpotifyTokens: async () => {},
  savePlaylists: async () => {},
  saveSettings: async () => {},
})

export function SimpleUserDataProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<SimpleUserData>({})
  const [isLoading, setIsLoading] = useState(false)

  const saveSpotifyTokens = async (accessToken: string, refreshToken: string, expiresIn: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("spotify_access_token", accessToken)
      localStorage.setItem("spotify_refresh_token", refreshToken)
      localStorage.setItem("spotify_token_expiry", (Date.now() + expiresIn * 1000).toString())
    }
  }

  const savePlaylists = async (playlists: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user_playlists", JSON.stringify(playlists))
    }
  }

  const saveSettings = async (settings: Record<string, any>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app_settings", JSON.stringify(settings))
    }
  }

  return (
    <SimpleUserDataContext.Provider
      value={{
        userData,
        isLoading,
        saveSpotifyTokens,
        savePlaylists,
        saveSettings,
      }}
    >
      {children}
    </SimpleUserDataContext.Provider>
  )
}

export function useSimpleUserData() {
  return useContext(SimpleUserDataContext)
}

