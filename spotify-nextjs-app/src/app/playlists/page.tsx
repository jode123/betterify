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
    <div className="h-screen overflow-hidden bg-black">
      {/* Fixed Header */}
      <div className="w-full bg-black/95 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-zinc-800">
        <h1 className="text-white text-2xl font-bold">Your Library</h1>
      </div>

      {/* Scrollable Content */}
      <div className="h-[calc(100vh-64px)] overflow-y-auto">
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