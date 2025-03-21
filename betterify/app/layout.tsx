import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-context"
import { AppSettingsProvider } from "@/hooks/use-app-settings"
import { ClerkProvider } from "@clerk/nextjs"
import { UserDataProvider } from "@/lib/user-data-context"
import { SimpleUserDataProvider } from "@/lib/fallback-user-data-context"

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>
            <AppSettingsProvider>
              {/* We're using a double-provider approach to handle build-time issues */}
              <SimpleUserDataProvider>
                <UserDataProvider>{children}</UserDataProvider>
              </SimpleUserDataProvider>
            </AppSettingsProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}



import './globals.css'