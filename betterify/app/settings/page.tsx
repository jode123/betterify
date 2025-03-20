import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import SettingsContent from "@/components/settings-content"

export default function SettingsPage() {
  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <SettingsContent />
      </div>
      <Player />
    </div>
  )
}

