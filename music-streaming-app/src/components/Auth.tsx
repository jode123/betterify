import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonButton } from '@ionic/react';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
  redirectUri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI
});

const Auth: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      handleCallback(code);
    }
  }, []);

  const handleLogin = () => {
    const scopes = ['user-read-private', 'playlist-read-private'];
    const authUrl = spotifyApi.createAuthorizeURL(scopes, '');
    window.location.href = authUrl;
  };

  const handleCallback = async (code: string) => {
    try {
      const data = await spotifyApi.authorizationCodeGrant(code);
      spotifyApi.setAccessToken(data.body.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  return (
    <IonPage>
      <IonContent>
        {!isAuthenticated ? (
          <IonButton onClick={handleLogin}>
            Login with Spotify
          </IonButton>
        ) : (
          <div>Authenticated!</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Auth;