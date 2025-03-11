const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "f386c406d93949f5b0e886d55e70804e";
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "https://betterify.vercel.app/callback";

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
    client_id: CLIENT_ID,
    response_type: 'token',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: 'true'
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};