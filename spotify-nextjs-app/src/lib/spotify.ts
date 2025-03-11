export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
export const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
export const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative'
].join(' ');

export const getLoginUrl = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID!,
    redirect_uri: REDIRECT_URI!,
    scope: SCOPES,
    response_type: 'token',
    show_dialog: 'true'
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

export const getTokenFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  const token = params.get('access_token');
  
  if (token) {
    localStorage.setItem('spotify_token', token);
    return token;
  }
  
  return null;
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('spotify_token');
};