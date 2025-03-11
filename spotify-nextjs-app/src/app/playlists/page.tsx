'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
  description?: string;
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

        if (!response.ok) throw new Error('Failed to fetch playlists');
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white/80 text-lg">Loading your library...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl font-bold">Library</h1>
          <button className="text-white/80 hover:text-white transition-colors">
            Sort By
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id}
              className="group relative bg-zinc-800/30 rounded-xl p-4 hover:bg-zinc-800/60 transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                {playlist.images[0]?.url ? (
                  <Image
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-white/60">No Cover</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <button className="absolute right-2 bottom-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <h2 className="text-white font-medium text-sm mb-1 truncate">{playlist.name}</h2>
              <p className="text-white/60 text-xs">{playlist.tracks.total} songs</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}