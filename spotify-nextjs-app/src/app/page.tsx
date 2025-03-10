import React, { useEffect, useState } from 'react';
import { fetchPlaylists } from '../lib/spotify';
import PlaylistCard from '../components/PlaylistCard';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Page = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const getPlaylists = async () => {
      const data = await fetchPlaylists();
      setPlaylists(data);
    };

    getPlaylists();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;