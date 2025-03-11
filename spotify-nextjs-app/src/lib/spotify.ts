export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
export const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
export const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

export const getSpotifyAuthUrl = () => {
  // Debug logs
  console.log('Generating Spotify Auth URL...');
  console.log('Environment variables:', {
    CLIENT_ID,
    REDIRECT_URI,
  });

  if (!CLIENT_ID || !REDIRECT_URI) {
    console.error('Missing environment variables');
    return '/';
  }

  try {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-read-collaborative',
        'streaming',
        'user-library-read',
      ].join(' '),
      show_dialog: 'true'
    });

    const authUrl = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
    console.log('Generated URL:', authUrl);
    return authUrl;
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return '/';
  }
};

export const getTokenFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  const token = params.get('access_token');
  
  if (token) {
    localStorage.setItem('spotify_access_token', token);
    return token;
  }
  
  return null;
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('spotify_access_token');
};