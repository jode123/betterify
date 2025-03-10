import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PlaylistCard from '../components/PlaylistCard';

const Home = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await fetch('/api/spotify');
      const data = await response.json();
      setPlaylists(data.playlists);
    };

    fetchPlaylists();
  }, []);

  return (
    <Layout>
      <h1>Your Playlists</h1>
      <div className="playlist-container">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </Layout>
  );
};

export default Home;