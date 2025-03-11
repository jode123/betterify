'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTokenFromUrl } from '@/lib/spotify';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const token = getTokenFromUrl();
    if (token) {
      // Clear the hash from URL
      window.location.hash = '';
      // Redirect to home page
      router.push('/');
    } else {
      // If no token, redirect to login
      router.push('/');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );
}