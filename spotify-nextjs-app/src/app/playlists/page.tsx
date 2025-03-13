'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Playlist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  tracks: {
    total: number;
    href: string;
  };
  owner: {
    display_name: string;
  };
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateAndFetchPlaylists = async () => {
      const token = localStorage.getItem('spotify_access_token');
      
      if (!token) {
        router.replace('/');
        return;
      }

      try {
        // First validate the token
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          // Token is invalid
          localStorage.removeItem('spotify_access_token');
          router.replace('/');
          return;
        }

        // Token is valid, fetch playlists
        const playlistResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!playlistResponse.ok) throw new Error('Failed to fetch playlists');
        const data = await playlistResponse.json();
        
        const sortedPlaylists = data.items.sort((a: Playlist, b: Playlist) => 
          a.name.localeCompare(b.name)
        );

        setPlaylists(sortedPlaylists);
      } catch (error) {
        console.error('Error:', error);
        localStorage.removeItem('spotify_access_token');
        router.replace('/');
      } finally {
        setLoading(false);
      }
    };

    validateAndFetchPlaylists();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white/80 text-lg">Loading your library...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed Header with Menu */}
      <div className="w-full bg-black/95 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-zinc-800 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Your Library</h1>
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-2 hover:bg-zinc-800/60 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className="block px-4 py-2 text-sm text-white hover:bg-zinc-700 w-full text-left"
                  role="menuitem"
                >
                  Playlists
                </button>
                <button
                  className="block px-4 py-2 text-sm text-white hover:bg-zinc-700 w-full text-left"
                  role="menuitem"
                >
                  Artists
                </button>
                <button
                  className="block px-4 py-2 text-sm text-white hover:bg-zinc-700 w-full text-left"
                  role="menuitem"
                >
                  Albums
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content with top margin */}
      <div className="overflow-y-auto mt-16">
        <ul className="flex flex-col gap-2 p-4">
          {playlists.map((playlist) => (
            <li 
              key={playlist.id}
              className="flex items-start w-full bg-zinc-800/30 hover:bg-zinc-800/60 transition-all duration-300 cursor-pointer rounded-md p-2"
            >
              {/* Image - Left aligned */}
              <div className="w-12 h-12 relative flex-shrink-0 mr-3">
                {playlist.images?.[0]?.url ? (
                  <Image
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-zinc-700 rounded-md flex items-center justify-center">
                    <span className="text-white/60 text-xs">No Cover</span>
                  </div>
                )}
              </div>

              {/* Text Content - Left aligned */}
              <div className="flex flex-col justify-center min-w-0">
                <h2 className="text-white text-sm font-medium truncate">
                  {playlist.name}
                </h2>
                <div className="flex items-center text-zinc-400 text-xs mt-0.5">
                  <span className="truncate">Playlist</span>
                  <span className="mx-1">•</span>
                  <span>{playlist.tracks.total} tracks</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}