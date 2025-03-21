"use client"

import { useEffect } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function SSOCallbackPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    async function handleCallback() {
      try {
        const result = await signUp.attemptFirstFactor({
          strategy: "oauth_callback",
        })

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId })
          router.push("/")
        }
      } catch (err) {
        console.error("Error during OAuth callback:", err)
        router.push("/sign-up?error=oauth-callback-failed")
      }
    }

    handleCallback()
  }, [isLoaded, signUp, setActive, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-xl font-semibold">Completing sign up...</h1>
      <p className="text-muted-foreground">Please wait while we complete the registration process.</p>
    </div>
  )
}

