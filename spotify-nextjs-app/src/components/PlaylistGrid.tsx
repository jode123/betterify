'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Playlist {
  id: string
  name: string
  images: { url: string }[]
  tracks: { total: number }
}

export default function PlaylistGrid() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const { data: session } = useSession()

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Your Playlists</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {playlists.map((playlist) => (
          <div 
            key={playlist.id}
            className="group relative bg-[#282828] rounded-lg p-4 hover:bg-[#383838] transition-colors duration-200"
          >
            <div className="aspect-square mb-4">
              <img 
                src={playlist.images[0]?.url || '/default-playlist.png'} 
                alt={playlist.name}
                className="w-full h-full object-cover rounded-md shadow-lg"
              />
            </div>
            <h3 className="text-white font-semibold truncate">{playlist.name}</h3>
            <p className="text-sm text-gray-400">{playlist.tracks.total} songs</p>
            <button className="absolute right-4 bottom-4 w-12 h-12 bg-[#1db954] rounded-full items-center justify-center text-black hidden group-hover:flex shadow-xl">
              <span className="material-icons">play_arrow</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}