"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { useUserData } from "@/lib/user-data-context"

// Default settings
const DEFAULT_SETTINGS = {
  audioQuality: "high",
  videoQuality: "medium",
  videoEnabled: false, // Video disabled by default
  searchResults: 10,
  cacheEnabled: true,
  cacheSize: 100,
  autoplay: true,
  crossfade: false,
  crossfadeDuration: 3,
  defaultVolume: 80,
  showLyrics: true,
  showRecommendations: true,
  preferredSource: "piped",
  uiDensity: "comfortable",
  showAlbumArt: true,
  showPlaybackControls: true,
  enableNotifications: true,
  enableKeyboardShortcuts: true,
}

type AppSettings = typeof DEFAULT_SETTINGS

interface AppSettingsContextType {
  settings: AppSettings
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  resetSettings: () => void
  saveSettings: () => void
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined)

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const { userData, saveSettings: saveUserSettings, isLoading } = useUserData()

  // Load settings from user data or localStorage on mount
  useEffect(() => {
    // First try to load from user data if it's available
    if (!isLoading && userData.settings) {
      setSettings((prev) => ({ ...prev, ...userData.settings }))
      return
    }

    // Fallback to localStorage
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("app_settings")
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings)
          setSettings((prev) => ({ ...prev, ...parsedSettings }))
        } catch (error) {
          console.error("Error parsing saved settings:", error)
        }
      }
    }
  }, [userData, isLoading])

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    saveUserSettings(DEFAULT_SETTINGS)
    localStorage.setItem("app_settings", JSON.stringify(DEFAULT_SETTINGS))
  }

  const saveSettings = () => {
    saveUserSettings(settings)
    localStorage.setItem("app_settings", JSON.stringify(settings))
  }

  return (
    <AppSettingsContext.Provider value={{ settings, updateSetting, resetSettings, saveSettings }}>
      {children}
    </AppSettingsContext.Provider>
  )
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext)
  if (context === undefined) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider")
  }
  return context
}

