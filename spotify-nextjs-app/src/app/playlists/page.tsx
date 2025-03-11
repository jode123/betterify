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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-white text-3xl font-bold mb-8">Library</h1>
        
        <ul className="space-y-3 w-full">
          {playlists.map((playlist) => (
            <li 
              key={playlist.id}
              className="flex items-center w-full bg-zinc-800/30 rounded-lg p-3 hover:bg-zinc-800/60 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="w-20 h-20 relative flex-shrink-0">
                  {playlist.images?.[0]?.url ? (
                    <Image
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      width={80}
                      height={80}
                      className="rounded-2xl object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-20 h-20 bg-zinc-700 rounded-2xl flex items-center justify-center">
                      <span className="text-white/60 text-sm">No Cover</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-medium text-lg truncate">
                    {playlist.name}
                  </h2>
                  <p className="text-white/60 text-sm flex items-center mt-1">
                    <span>{playlist.tracks.total} tracks</span>
                    <span className="mx-2">•</span>
                    <span className="truncate">{playlist.owner.display_name}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}