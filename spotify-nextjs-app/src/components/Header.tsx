import React from 'react';
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-[#282828]/95 backdrop-blur-md sticky top-0 z-10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40">
            <span className="material-icons text-white">chevron_left</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40">
            <span className="material-icons text-white">chevron_right</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {session?.user?.image && (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-8 h-8 rounded-full"
            />
          )}
          <button
            onClick={() => signOut()}
            className="text-sm text-white hover:text-gray-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}