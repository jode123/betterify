import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { handleSpotifyCallback } from '../utils/spotifyAuth';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const token = handleSpotifyCallback();
    if (token) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-white">Authenticating...</div>
    </div>
  );
}