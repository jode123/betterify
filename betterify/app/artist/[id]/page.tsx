import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import { ArtistDetail } from "@/components/artist-detail"

export default function ArtistPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <ArtistDetail id={params.id} />
      </div>
      <Player />
    </div>
  )
}

