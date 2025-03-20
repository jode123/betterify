"use client"

import type * as React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "data-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    const savedTheme = localStorage.getItem(storageKey) as Theme | null

    if (savedTheme) {
      setTheme(savedTheme)
      root.setAttribute(attribute, savedTheme)
    } else if (enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
      root.setAttribute(attribute, systemTheme)
    } else {
      root.setAttribute(attribute, defaultTheme)
    }
  }, [attribute, defaultTheme, enableSystem, storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    if (disableTransitionOnChange) {
      root.classList.add("no-transitions")
      window.setTimeout(() => {
        root.classList.remove("no-transitions")
      }, 0)
    }

    root.setAttribute(attribute, theme)
    localStorage.setItem(storageKey, theme)
  }, [theme, attribute, disableTransitionOnChange, storageKey])

  const value = {
    theme,
    setTheme,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

