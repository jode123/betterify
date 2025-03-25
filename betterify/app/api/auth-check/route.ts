import { type NextRequest, NextResponse } from "next/server"
import { logAdminAction } from "@/lib/admin-logger"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"

  try {
    // In a real app, you would check the session here
    // For now, we'll just allow access
    const isAdmin = true
    const ip = request.headers.get("x-forwarded-for") || "unknown"

    // Check if user is authenticated and is an admin
    if (!isAdmin) {
      // Log unauthorized access attempt
      logAdminAction({
        action: "UNAUTHORIZED_ACCESS",
        path: callbackUrl,
        userId: "unauthenticated",
        ip,
        details: "Attempted to access admin area without proper permissions",
      })

      // Redirect to unauthorized page
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    // Add security headers
    const response = NextResponse.redirect(new URL(callbackUrl, request.url))
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "same-origin")
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

    // Log successful access
    logAdminAction({
      action: "ADMIN_ACCESS",
      path: callbackUrl,
      userId: "admin",
      ip,
      details: "Admin accessed protected area",
    })

    return response
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }
}

