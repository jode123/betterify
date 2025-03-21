"use client"

import { useEffect } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function SSOCallbackPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    async function handleCallback() {
      try {
        const result = await signIn.attemptFirstFactor({
          strategy: "oauth_callback",
        })

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId })
          router.push("/")
        }
      } catch (err) {
        console.error("Error during OAuth callback:", err)
        router.push("/sign-in?error=oauth-callback-failed")
      }
    }

    handleCallback()
  }, [isLoaded, signIn, setActive, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-xl font-semibold">Completing sign in...</h1>
      <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
    </div>
  )
}

