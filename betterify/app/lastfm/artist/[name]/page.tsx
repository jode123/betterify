import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import { LastFmArtistDetail } from "@/components/lastfm-artist-detail"

export default function LastFmArtistPage({ params }: { params: { name: string } }) {
  const artistName = decodeURIComponent(params.name)

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <LastFmArtistDetail name={artistName} />
      </div>
      <Player />
    </div>
  )
}

