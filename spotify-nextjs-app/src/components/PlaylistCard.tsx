import React from 'react';

interface PlaylistCardProps {
    title: string;
    description: string;
    imageUrl: string;
    onClick: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ title, description, imageUrl, onClick }) => {
    return (
        <div className="playlist-card" onClick={onClick}>
            <img src={imageUrl} alt={title} className="playlist-image" />
            <div className="playlist-info">
                <h3 className="playlist-title">{title}</h3>
                <p className="playlist-description">{description}</p>
            </div>
        </div>
    );
};

export default PlaylistCard;