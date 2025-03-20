'use client'

export function SpotifyLoginButton() {
  const handleLogin = async () => {
    try {
      // Get auth URL from our API
      const response = await fetch('/api/spotify/auth')
      const { url } = await response.json()
      
      // Redirect to Spotify auth page
      window.location.href = url
    } catch (error) {
      console.error('Failed to initialize Spotify auth:', error)
    }
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
    >
      Connect with Spotify
    </button>
  )
}