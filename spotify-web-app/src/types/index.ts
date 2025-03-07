export interface Playlist {
    id: string;
    title: string;
    image: string;
    tracks: Track[];
}

export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: number; // duration in milliseconds
}