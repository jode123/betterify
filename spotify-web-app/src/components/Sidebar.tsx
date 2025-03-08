import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>Spotify</h1>
      </div>
      <nav className="nav-menu">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/library">Your Library</Link>
      </nav>
      <div className="playlists-menu">
        <h2>Playlists</h2>
        {/* Playlist list will go here */}
      </div>
    </div>
  );
};

export default Sidebar;