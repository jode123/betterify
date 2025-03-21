"use client"

import type React from "react"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Music, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const { isLoaded, signIn } = useSignIn()

  // Form state
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [resetStatus, setResetStatus] = useState<"idle" | "start" | "verify" | "complete">("idle")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Start password reset
  const handleStartReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    try {
      setLoading(true)
      setError("")

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      })

      setResetStatus("verify")
    } catch (err: any) {
      console.error("Error starting password reset:", err)
      setError(err.errors?.[0]?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Verify code and reset password
  const handleVerifyReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    try {
      setLoading(true)
      setError("")

      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })

      if (result.status === "complete") {
        setResetStatus("complete")
      } else {
        setError("Password reset failed. Please try again.")
      }
    } catch (err: any) {
      console.error("Error verifying password reset:", err)
      setError(err.errors?.[0]?.message || "Verification failed. Please try again.")
    } finally {
      setLoading(false)
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
          <p className="text-muted-foreground mt-1">Reset your password</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              {resetStatus === "complete"
                ? "Password Reset Complete"
                : resetStatus === "verify"
                  ? "Verify and Reset"
                  : "Reset Password"}
            </CardTitle>
            <CardDescription>
              {resetStatus === "complete"
                ? "Your password has been successfully reset"
                : resetStatus === "verify"
                  ? "Enter the code sent to your email and your new password"
                  : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resetStatus === "complete" ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-center mb-4">
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>
                <Button asChild className="w-full">
                  <Link href="/sign-in">Go to Sign In</Link>
                </Button>
              </div>
            ) : resetStatus === "verify" ? (
              <form onSubmit={handleVerifyReset} className="space-y-4">
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
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
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
                  Reset Password
                </Button>
              </form>
            ) : (
              <form onSubmit={handleStartReset} className="space-y-4">
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Instructions
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Remember your password?{" "}
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

