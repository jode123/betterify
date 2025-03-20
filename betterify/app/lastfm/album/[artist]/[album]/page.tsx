import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import { LastFmAlbumDetail } from "@/components/lastfm-album-detail"

export default function LastFmAlbumPage({ params }: { params: { artist: string; album: string } }) {
  const artistName = decodeURIComponent(params.artist)
  const albumName = decodeURIComponent(params.album)

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <LastFmAlbumDetail artist={artistName} album={albumName} />
      </div>
      <Player />
    </div>
  )
}

