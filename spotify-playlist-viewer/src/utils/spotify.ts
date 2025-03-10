import axios from 'axios';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

export const fetchPlaylists = async (accessToken: string) => {
    try {
        const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/playlists`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching playlists:', error);
        throw error;
    }
};

// Additional utility functions for interacting with the Spotify API can be added here.