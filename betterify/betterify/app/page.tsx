import { Sidebar } from "@/components/sidebar"
import Player from "@/components/player"
import { MainContent } from "@/components/main-content"

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <Player />
    </div>
  )
}

