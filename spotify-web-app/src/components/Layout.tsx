import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <header>
                <h1>Spotify Playlist Viewer</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Spotify Playlist Viewer</p>
            </footer>
        </div>
    );
};

export default Layout;