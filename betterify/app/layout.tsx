import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-context"
import { SessionProvider } from "@/components/session-provider"
import { Toaster } from "@/components/ui/toaster"
import { CopyrightWarningProvider } from "@/components/copyright-warning-modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Music App",
  description: "A modern music streaming application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            <CopyrightWarningProvider>
              {children}
              <Toaster />
            </CopyrightWarningProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}



import './globals.css'