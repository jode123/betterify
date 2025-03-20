import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import { PlayerProvider } from "../contexts/PlayerContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Betterify Music",
  description: "A clean music streaming app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
          <PlayerProvider>{children}</PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

