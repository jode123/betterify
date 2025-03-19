import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import { SearchContent } from "@/components/search-content"

export default function SearchPage() {
  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <SearchContent />
      </div>
      <Player />
    </div>
  )
}

