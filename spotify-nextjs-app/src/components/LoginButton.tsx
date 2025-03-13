'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    const CLIENT_ID = "f386c406d93949f5b0e886d55e70804e";
    const CLIENT_SECRET = "0b15b2f8af744fdc89a354f2d4c333c3";
    const REDIRECT_URI = "https://betterify.vercel.app/callback"; // Changed back to /callback
    
    const scope = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
      'streaming',
      'user-library-read',
    ].join(' ');

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      scope: scope,
      response_type: 'token',
      show_dialog: 'true'
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  const handleSkipAuth = () => {
    localStorage.setItem('skip_auth', 'true')
    router.push('/discover')
  }

  return (
    <div className="page-fixed center-container login-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="login-container"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 w-full"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="logo-container"
          >
            <Image 
              src="/images/logo.png"
              alt="Logo"
              width={32}
              height={32}
              priority
              className="logo-image"
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[var(--text-primary)] text-2xl font-bold"
          >
            Betterify
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[var(--text-secondary)] text-sm"
          >
            Your music. Your way.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={handleLogin}
            className="apple-button w-40 bg-[var(--system-pink)] hover:bg-[var(--system-red)] 
              py-2 text-sm text-[var(--text-primary)]
              transition-all duration-200 rounded-md
              shadow-lg hover:shadow-xl"
          >
            Connect with Spotify
          </motion.button>

          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={handleSkipAuth}
              className="px-6 py-3 bg-[var(--background-secondary)] text-[var(--text-primary)] rounded-full hover:bg-[var(--background-tertiary)] transition-colors"
            >
              Skip Login (Dev Mode)
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}


