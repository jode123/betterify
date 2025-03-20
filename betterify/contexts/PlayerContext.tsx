"use client"

import { createContext, useContext, useState, useEffect } from 'react'

interface Track {
  id: string
  name: string
  artist: string
  url: string
}

interface PlayerContextType {
  isPlaying: boolean
  track: Track | null
  volume: number
  isMuted: boolean
  isDarkMode: boolean
  setTrack: (track: Track | null) => void
  togglePlay: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleDarkMode: () => void
}

// Create context with initial undefined value
const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

// Export the provider component
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [track, setTrack] = useState<Track | null>(null)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const togglePlay = () => setIsPlaying(prev => !prev)
  const toggleMute = () => setIsMuted(prev => !prev)
  const toggleDarkMode = () => setIsDarkMode(prev => !prev)

  // Effect to persist dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      setIsDarkMode(savedMode === 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const value = {
    isPlaying,
    track,
    volume,
    isMuted,
    isDarkMode,
    setTrack,
    togglePlay,
    setVolume,
    toggleMute,
    toggleDarkMode
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}

// Export the hook
export function usePlayer(): PlayerContextType {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}

// Export the context for direct usage if needed
export { PlayerContext }