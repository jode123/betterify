"use client"

import type React from "react"

import { useState } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Music } from "lucide-react"

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Handle sign up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    try {
      setLoading(true)
      setError("")

      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      })

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      // Change UI to show verification form
      setPendingVerification(true)
    } catch (err: any) {
      console.error("Error during sign up:", err)
      setError(err.errors?.[0]?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    try {
      setLoading(true)
      setError("")

      const result = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (result.status === "complete") {
        // Sign up was successful
        await setActive({ session: result.createdSessionId })
        router.push("/")
      } else {
        setError("Verification failed. Please try again.")
      }
    } catch (err: any) {
      console.error("Error during verification:", err)
      setError(err.errors?.[0]?.message || "Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle OAuth sign up
  const handleOAuthSignUp = async (provider: "oauth_google" | "oauth_github" | "oauth_spotify") => {
    if (!isLoaded) return

    try {
      const result = await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sign-up/sso-callback",
        redirectUrlComplete: "/",
      })
    } catch (err: any) {
      console.error("Error during OAuth sign up:", err)
      setError(err.errors?.[0]?.message || "Something went wrong. Please try again.")
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary mb-4">
            <Music className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Music App</h1>
          <p className="text-muted-foreground mt-1">Create your account</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{pendingVerification ? "Verify Email" : "Sign Up"}</CardTitle>
            <CardDescription>
              {pendingVerification
                ? "We've sent a verification code to your email"
                : "Enter your information to create an account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!pendingVerification ? (
              <>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignUp("oauth_google")}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignUp("oauth_spotify")}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                        fill="#1ED760"
                      />
                      <path
                        d="M16.7917 16.5833C16.625 16.5833 16.4583 16.5417 16.2917 16.4167C15.2083 15.7917 13.9583 15.375 12.625 15.375C11.5 15.375 10.375 15.5833 9.33333 15.9583C9.125 16.0417 8.91667 16.0833 8.75 16.0833C8.20833 16.0833 7.79167 15.6667 7.79167 15.125C7.79167 14.7083 8 14.375 8.33333 14.2083C9.625 13.75 11 13.5 12.4167 13.5C14.125 13.5 15.7083 13.9583 17.125 14.7917C17.4583 14.9583 17.625 15.2917 17.625 15.625C17.7917 16.1667 17.375 16.5833 16.7917 16.5833ZM17.9583 13.5C17.75 13.5 17.5833 13.4583 17.375 13.3333C16.0417 12.5417 14.5 12.0417 12.875 12.0417C11.5417 12.0417 10.25 12.2917 9.04167 12.75C8.83333 12.8333 8.625 12.875 8.45833 12.875C7.79167 12.875 7.25 12.3333 7.25 11.6667C7.25 11.1667 7.5 10.75 7.91667 10.5833C9.41667 10 10.9583 9.70833 12.625 9.70833C14.7083 9.70833 16.6667 10.2917 18.375 11.2917C18.7917 11.5417 19 11.9583 19 12.4167C19.1667 13.0417 18.625 13.5 17.9583 13.5ZM19.2917 10C19.0833 10 18.875 9.95833 18.6667 9.83333C17.0417 8.91667 15.125 8.33333 13.125 8.33333C11.5417 8.33333 10 8.625 8.5 9.20833C8.29167 9.29167 8.04167 9.33333 7.83333 9.33333C7 9.33333 6.33333 8.66667 6.33333 7.83333C6.33333 7.20833 6.70833 6.70833 7.25 6.5C9.08333 5.79167 11 5.41667 13 5.41667C15.5 5.41667 17.9167 6.125 20 7.29167C20.5 7.58333 20.7917 8.08333 20.7917 8.66667C20.7917 9.41667 20.125 10 19.2917 10Z"
                        fill="white"
                      />
                    </svg>
                    Spotify
                  </Button>
                </div>

                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6-digit code"
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify Email
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

