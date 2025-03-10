import React from 'react';

const Player: React.FC = () => {
    return (
        <div className="player">
            <h2>Now Playing</h2>
            <div className="track-info">
                <p>Track Name</p>
                <p>Artist Name</p>
            </div>
            <div className="controls">
                <button>Play</button>
                <button>Pause</button>
                <button>Next</button>
                <button>Previous</button>
            </div>
        </div>
    );
};

export default Player;