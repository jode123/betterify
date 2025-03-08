import axios from 'axios';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

interface SpotifyResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export const spotifyApi = {
  getUserPlaylists: async (accessToken: string): Promise<SpotifyResponse<any>> => {
    try {
      const response = await axios.get(`${SPOTIFY_BASE_URL}/me/playlists`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw error;
    }
  }
};

export const getPlaylistDetails = async (playlistId: string, accessToken: string) => {
    const response = await axios.get(`${SPOTIFY_BASE_URL}/playlists/${playlistId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const searchTracks = async (query: string, accessToken: string) => {
    const response = await axios.get(`${SPOTIFY_BASE_URL}/search`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            q: query,
            type: 'track',
        },
    });
    return response.data.tracks.items;
};