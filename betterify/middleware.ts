import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export default function middleware(req) {
  // Get the user from the auth function
  const { userId } = auth()

  // List of public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/piped/search",
    "/api/piped/stream",
    "/api/lastfm/",
    "/search",
    "/artist/",
    "/lastfm/",
    "/album/",
    "/playlist/",
    "/api/proxy/",
  ]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(
    (route) => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route),
  )

  // Allow access to public routes even without authentication
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If not a public route and not authenticated, redirect to sign in
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  // Otherwise, allow access to the protected route
  return NextResponse.next()
}

export const config = {
  // Skip middleware for static files, public files, and _next
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

