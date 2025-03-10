// src/types/index.ts

export interface Playlist {
    id: string;
    name: string;
    description: string;
    images: Array<{ url: string }>;
    tracks: Track[];
}

export interface Track {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: { name: string; images: Array<{ url: string }> };
}