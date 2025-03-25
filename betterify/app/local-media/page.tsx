import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import { LocalMediaContent } from "@/components/local-media-content"

export default function LocalMediaPage() {
  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Local Media</h1>
          <LocalMediaContent />
        </div>
      </div>
      <Player />
    </div>
  )
}

