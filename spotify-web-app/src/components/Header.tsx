import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">
        Spotify Web App
      </Link>
      <nav>
        <Link to="/playlists">Playlists</Link>
        <Link to="/search">Search</Link>
      </nav>
    </header>
  );
};

export default Header;