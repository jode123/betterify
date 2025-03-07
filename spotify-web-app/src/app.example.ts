import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import PlaylistCard from './components/PlaylistCard';
import Player from './components/Player';
import './styles/index.css';

const App = () => {
    return (
        <div>
            <Header />
            <div className="playlist-container">
                {/* Example of rendering PlaylistCard components */}
                {/* This should be replaced with actual playlist data */}
                <PlaylistCard title="My Playlist" image="playlist-image-url" />
            </div>
            <Player />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));