import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProxiedImageUrl(url: string) {
  if (!url || url.includes("placeholder.svg")) {
    return url
  }

  // If it's a Last.fm image, proxy it
  if (url.includes("lastfm.") || url.includes("last.fm")) {
    return `/api/proxy/image?url=${encodeURIComponent(url)}`
  }

  // Return Spotify images directly
  return url
}

