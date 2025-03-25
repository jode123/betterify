
"use client"

import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import { SettingsContent } from "@/components/settings-content"
import { Suspense } from "react"

// Create a loading component for Suspense fallback
function SettingsLoading() {
  return <div className="flex-1 p-4">Loading settings...</div>
}

export default function SettingsPage() {
  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Suspense fallback={<SettingsLoading />}>
          <SettingsContent />
        </Suspense>
      </div>
      <Player />
    </div>
  )
}
