import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PlayerProvider } from '@/contexts/PlayerContext'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Music App",
  description: "A clean music streaming app inspired by Apple Music",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </body>
    </html>
  )
}

import './globals.css'