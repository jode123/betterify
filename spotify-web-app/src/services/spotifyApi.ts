import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';

export const getPlaylists = async (accessToken: string) => {
    const response = await axios.get(`${BASE_URL}/me/playlists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data.items;
};

export const getPlaylistDetails = async (playlistId: string, accessToken: string) => {
    const response = await axios.get(`${BASE_URL}/playlists/${playlistId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const searchTracks = async (query: string, accessToken: string) => {
    const response = await axios.get(`${BASE_URL}/search`, {
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