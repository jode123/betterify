// src/services/spotify.ts

import axios from 'axios';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

export const login = async (token: string) => {
    // Logic for logging in with the Spotify API using the provided token
};

export const fetchUserPlaylists = async (token: string) => {
    const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/playlists`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.items;
};

export const getTrackDetails = async (trackId: string, token: string) => {
    const response = await axios.get(`${SPOTIFY_API_BASE_URL}/tracks/${trackId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};