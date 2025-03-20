import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import { UserPlaylistDetail } from "@/components/user-playlist-detail"

export default function UserPlaylistPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <UserPlaylistDetail id={params.id} />
      </div>
      <Player />
    </div>
  )
}

