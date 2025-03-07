import React, { useEffect, useState } from 'react';
import { fetchUserPlaylists } from '../services/spotify';
import { Playlist as PlaylistType } from '../types';

const Playlist: React.FC = () => {
    const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getPlaylists = async () => {
            try {
                const data = await fetchUserPlaylists();
                setPlaylists(data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            } finally {
                setLoading(false);
            }
        };

        getPlaylists();
    }, []);

    if (loading) {
        return <div>Loading playlists...</div>;
    }

    return (
        <div>
            <h2>Your Playlists</h2>
            <ul>
                {playlists.map((playlist) => (
                    <li key={playlist.id}>
                        <h3>{playlist.name}</h3>
                        <p>{playlist.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Playlist;