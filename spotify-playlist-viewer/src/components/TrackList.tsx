import React from 'react';

interface Track {
  title: string;
  artist: string;
}

interface TrackListProps {
  tracks: Track[];
}

const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  return (
    <ul>
      {tracks.map((track, index) => (
        <li key={index}>
          <strong>{track.title}</strong> by {track.artist}
        </li>
      ))}
    </ul>
  );
};

export default TrackList;