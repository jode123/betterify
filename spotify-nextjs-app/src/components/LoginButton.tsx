'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Updated to next/navigation for app router
import { getSpotifyAuthUrl } from '../utils/spotifyAuth'; // Fixed import path

const LoginButton = () => { // Changed name to match file name
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <button
        onClick={handleLogin}
        className="rounded-full bg-[#1db954] px-8 py-4 text-lg font-bold text-white hover:bg-[#1ed760]"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default LoginButton;


















































































































































































































