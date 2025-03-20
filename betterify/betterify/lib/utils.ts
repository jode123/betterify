import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Modified to return the original URL for Last.fm images
export function getProxiedImageUrl(url: string | undefined): string {
  if (!url) return "/placeholder.svg?height=300&width=300"

  // Return the original URL directly for Last.fm images
  if (url.includes("lastfm.freetls.fastly.net") || url.includes("last.fm")) {
    return url
  }

  // For other sources, use the proxy if needed
  return url
}

