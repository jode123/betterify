'use client'

import { useSession } from 'next-auth/react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import PlaylistGrid from '../components/PlaylistGrid'
import { LoginButton } from '@/components/LoginButton'

export default function Home() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-8">Music</h1>
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