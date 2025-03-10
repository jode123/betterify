import React from 'react';

interface PlaylistCardProps {
    title: string;
    imageUrl: string;
    description: string;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ title, imageUrl, description }) => {
    return (
        <div className="playlist-card">
            <img src={imageUrl} alt={title} className="playlist-image" />
            <h3 className="playlist-title">{title}</h3>
            <p className="playlist-description">{description}</p>
        </div>
    );
};

export default PlaylistCard;