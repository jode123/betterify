"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type ThemeColor, getThemeColor } from "./themes"

interface ThemeContextType {
  themeColor: ThemeColor
  setThemeColor: (color: ThemeColor) => void
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = useState<ThemeColor>("blue")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load theme preferences from localStorage on mount
  useEffect(() => {
    const storedThemeColor = localStorage.getItem("theme-color") as ThemeColor
    const storedDarkMode = localStorage.getItem("dark-mode")

    if (storedThemeColor && Object.keys(getThemeColor(storedThemeColor)).length) {
      setThemeColor(storedThemeColor)
    }

    if (storedDarkMode !== null) {
      setIsDarkMode(storedDarkMode === "true")
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  // Update localStorage and apply theme when changed
  useEffect(() => {
    localStorage.setItem("theme-color", themeColor)
    localStorage.setItem("dark-mode", String(isDarkMode))

    // Apply theme to document
    const theme = getThemeColor(themeColor)
    document.documentElement.style.setProperty("--theme-primary", theme.primaryColor)
    document.documentElement.style.setProperty("--theme-primary-hover", theme.primaryColorHover)
    document.documentElement.style.setProperty("--theme-glow", theme.glowColor)

    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [themeColor, isDarkMode])

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor, isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

