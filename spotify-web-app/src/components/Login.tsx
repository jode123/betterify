/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPOTIFY_CLIENT_ID: string
  readonly VITE_SPOTIFY_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

import React from 'react';

const Login: React.FC = () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = encodeURIComponent(import.meta.env.VITE_SPOTIFY_REDIRECT_URI);
  const scope = encodeURIComponent('playlist-read-private playlist-read-collaborative user-library-read');

  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <div className="login-container">
      <h1>Welcome to Spotify Web App</h1>
      <button onClick={handleLogin} className="login-button">
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;