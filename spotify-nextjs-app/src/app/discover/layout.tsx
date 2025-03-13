import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discover - Betterify',
  description: 'Discover new music and artists',
  openGraph: {
    title: 'Discover - Betterify',
    description: 'Discover new music and artists',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover - Betterify',
    description: 'Discover new music and artists',
  }
}

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}