import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProxiedImageUrl(imageUrl: string): string {
  if (!imageUrl) return imageUrl

  // If the URL is already proxied, return it
  if (imageUrl.startsWith("/api/proxy/image")) return imageUrl

  // Construct the proxied URL
  return `/api/proxy/image?url=${encodeURIComponent(imageUrl)}`
}

