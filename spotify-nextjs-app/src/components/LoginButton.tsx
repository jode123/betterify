'use client'

import { getLoginUrl } from '@/lib/spotify'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = getLoginUrl()
  }

  return (
    <div className="center-container">
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
            className="w-40 apple-button bg-[var(--system-pink)] hover:bg-[var(--system-red)] 
              py-2 text-sm text-[var(--text-primary)]
              transition-all duration-200 rounded-md
              shadow-lg hover:shadow-xl"
          >
            Connect with Spotify
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}


