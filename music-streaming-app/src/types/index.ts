// src/types/index.ts

export interface User {
    id: string;
    name: string;
    email: string;
    profileImage: string;
}

export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: number; // duration in seconds
    previewUrl?: string; // optional preview URL
}

export interface Playlist {
    id: string;
    name: string;
    description: string;
    tracks: Track[];
}