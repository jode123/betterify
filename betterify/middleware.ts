import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected admin routes
const ADMIN_ROUTES = ["/admin", "/api/admin"]

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
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
  "/api/auth",
  "/unauthorized",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current route is an admin route
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(route))

  // Check if the route is public
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route))

  // For admin routes, redirect to auth check page
  if (isAdminRoute) {
    // Instead of checking auth here, redirect to a server component that will check auth
    return NextResponse.rewrite(new URL(`/api/auth-check?callbackUrl=${encodeURIComponent(pathname)}`, request.url))
  }

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For other protected routes, we'll handle auth in the page components
  return NextResponse.next()
}

export const config = {
  // Skip middleware for static files, public files, and _next
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

