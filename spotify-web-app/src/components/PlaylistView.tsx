import React, { useEffect, useState } from 'react';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
}

const PlaylistView: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    // TODO: Implement Spotify API call to fetch playlists
    const fetchPlaylists = async () => {
      // Spotify API integration will go here
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="playlist-view">
      <h1>Your Playlists</h1>
      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <img src={playlist.images[0]?.url} alt={playlist.name} />
            <h3>{playlist.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistView;