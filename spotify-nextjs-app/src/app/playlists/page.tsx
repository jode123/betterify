'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
}

export default function PlaylistsPage() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const token = localStorage.getItem('spotify_access_token');
      
      if (!token) {
        router.replace('/');
        return;
      }

      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch playlists');
        }

        const data = await response.json();
        setPlaylists(data.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        router.replace('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading playlists...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-white text-3xl font-bold mb-8">Your Playlists</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="bg-[#282828] p-4 rounded-lg hover:bg-[#383838] transition-colors cursor-pointer"
          >
            <img 
              src={playlist.images[0]?.url || '/default-playlist.png'} 
              alt={playlist.name}
              className="w-full aspect-square object-cover rounded-md mb-4"
            />
            <h2 className="text-white font-semibold truncate">{playlist.name}</h2>
            <p className="text-gray-400 text-sm">{playlist.tracks.total} tracks</p>
          </div>
        ))}
      </div>
    </div>
  );
}