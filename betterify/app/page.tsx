import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
// Method 1: Direct import
import { MainContent } from "@/components/main-content"
// Method 2: If that doesn't work, try this:
// import MainContent from "@/components/MainContent"

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

