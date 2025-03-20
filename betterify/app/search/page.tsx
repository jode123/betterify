import { Sidebar } from "@/components/sidebar"
import Player from "@/components/player"
import { SearchContent } from "@/components/search-content"
import { Suspense } from 'react'

export default function SearchPage() {
  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Suspense fallback={<div>Loading...</div>}>
          <SearchContent />
        </Suspense>
      </div>
      <Player />
    </div>
  )
}

