'use client'

import { useEffect, useState } from 'react'
import { getStoredToken } from '@/lib/spotify'
import LoginButton from '@/components/LoginButton'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import PlaylistGrid from '@/components/PlaylistGrid'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212]">
        <div className="m-auto flex flex-col items-center justify-center gap-8 p-8">
          <div className="text-center space-y-4">
            <h1 className="text-7xl font-bold text-white mb-2">Music</h1>
            <p className="text-xl text-gray-400">All your favorite songs in one place.</p>
          </div>
          <LoginButton />
        </div>
      </main>
    )
  }

  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <PlaylistGrid />
      </main>
    </div>
  )
}