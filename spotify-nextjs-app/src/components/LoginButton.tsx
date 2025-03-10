'use client'

import { signIn } from 'next-auth/react'

export function LoginButton() {
  return (
    <button
      onClick={() => signIn('spotify')}
      className="bg-[#1db954] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1ed760] transition-colors duration-200"
    >
      Sign in with Spotify
    </button>
  )
}