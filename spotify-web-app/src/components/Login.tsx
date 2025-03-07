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
  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
      scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative',
      show_dialog: 'true'
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
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