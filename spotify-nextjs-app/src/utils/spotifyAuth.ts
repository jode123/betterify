const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'streaming',
  'user-library-read',
  'user-top-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
].join(' ');

export const getSpotifyAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID!,
    response_type: 'token',
    redirect_uri: REDIRECT_URI!,
    scope: SCOPES,
    show_dialog: 'true'
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const handleSpotifyCallback = () => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      localStorage.setItem('spotify_access_token', accessToken);
      return accessToken;
    }
  }
  return null;
};