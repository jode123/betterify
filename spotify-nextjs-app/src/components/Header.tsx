import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1 className="header-title">My Playlists</h1>
            <nav className="header-nav">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;