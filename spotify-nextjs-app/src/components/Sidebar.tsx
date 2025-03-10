import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <h2>My Playlists</h2>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/playlists">Playlists</a></li>
                    <li><a href="/favorites">Favorites</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
            </nav>
            <div className="user-info">
                <p>User Name</p>
                <p>user@example.com</p>
            </div>
        </div>
    );
};

export default Sidebar;