"use client"

import { useState } from "react"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function UserAuthButton() {
  const { isLoaded, isSignedIn } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  if (!isLoaded) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />
  }

  return (
    <div className="flex items-center space-x-2">
      <SignInButton mode="modal">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button size="sm">Sign Up</Button>
      </SignUpButton>
    </div>
  )
}

