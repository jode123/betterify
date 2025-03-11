'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    // Get the hash from the URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      localStorage.setItem('spotify_access_token', accessToken);
      router.replace('/playlists');
    } else {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-white">Authenticating...</div>
    </div>
  );
}