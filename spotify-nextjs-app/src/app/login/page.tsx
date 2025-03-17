'use client'

import { useRouter } from 'next/navigation'
import './login.css'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    // Your login logic here
    router.push('/discover')
  }

  const handleSkip = () => {
    router.push('/discover')
  }

  return (
    <div className="centered-container">
      <div className="content-centered">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Welcome to Musish</h1>
            <p className="login-subtitle">Connect with your favorite music</p>
            <button className="login-button" onClick={handleLogin}>
              Get Started
            </button>
            <button className="skip-button" onClick={handleSkip}>
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}