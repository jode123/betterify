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

// Create a default context value to avoid undefined errors
const defaultThemeContext: ThemeContextType = {
  themeColor: "blue",
  setThemeColor: () => {},
  isDarkMode: false,
  setIsDarkMode: () => {},
}

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = useState<ThemeColor>("blue")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only run on client side
  useEffect(() => {
    setMounted(true)

    try {
      const storedThemeColor = localStorage.getItem("theme-color") as ThemeColor
      const storedDarkMode = localStorage.getItem("dark-mode")

      if (storedThemeColor && getThemeColor(storedThemeColor)) {
        setThemeColor(storedThemeColor)
      }

      if (storedDarkMode !== null) {
        setIsDarkMode(storedDarkMode === "true")
      } else {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setIsDarkMode(prefersDark)
      }
    } catch (error) {
      console.error("Error loading theme preferences:", error)
    }
  }, [])

  // Update localStorage and apply theme when changed
  useEffect(() => {
    if (!mounted) return

    try {
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
    } catch (error) {
      console.error("Error saving theme preferences:", error)
    }
  }, [themeColor, isDarkMode, mounted])

  // Provide the actual values only after mounting to avoid hydration mismatch
  const contextValue = mounted ? { themeColor, setThemeColor, isDarkMode, setIsDarkMode } : defaultThemeContext

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

