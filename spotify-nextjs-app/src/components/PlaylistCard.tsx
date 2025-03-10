import React from 'react';

interface PlaylistCardProps {
  playlist: {
    id: string
    name: string
    images: { url: string }[]
    tracks: { total: number }
  }
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors cursor-pointer">
      <div className="aspect-square">
        <img 
          src={playlist.images[0]?.url || '/default-playlist.png'} 
          alt={playlist.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{playlist.name}</h3>
        <p className="text-gray-400 text-sm">{playlist.tracks.total} songs</p>
      </div>
    </div>
  )
}