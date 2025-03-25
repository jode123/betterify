"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CopyrightWarningModal, useCopyrightWarning } from "@/components/copyright-warning-modal"
import { useToast } from "@/hooks/use-toast"
import { Download, Search } from "lucide-react"

export default function DownloadPage() {
  const [url, setUrl] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [audioOnly, setAudioOnly] = useState(true)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const { isWarningOpen, showCopyrightWarning, handleProceed, handleClose } = useCopyrightWarning()
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!url) return

    try {
      setIsSearching(true)

      // Extract video ID from URL if it's a YouTube URL
      let videoId = url
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const urlObj = new URL(url)
        if (url.includes("youtube.com")) {
          videoId = urlObj.searchParams.get("v") || ""
        } else if (url.includes("youtu.be")) {
          videoId = urlObj.pathname.substring(1)
        }
      }

      if (!videoId) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid YouTube URL or video ID.",
          variant: "destructive",
        })
        return
      }

      // Simulate search results
      setSearchResults([
        {
          videoId,
          title: "Sample Track",
          artist: "Sample Artist",
          thumbnailUrl: "/placeholder.svg?height=200&width=200",
        },
      ])
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Failed",
        description: "There was an error searching for this video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleDownload = (videoId: string, title: string, artist: string) => {
    showCopyrightWarning(() => startDownload(videoId, title, artist))
  }

  const startDownload = async (videoId: string, title: string, artist: string) => {
    try {
      setIsDownloading(true)

      const response = await fetch(
        `/api/download?videoId=${videoId}&audioOnly=${audioOnly}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`,
      )

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const data = await response.json()

      if (data.downloadUrl) {
        // Create a temporary link to download the file
        const a = document.createElement("a")
        a.href = data.downloadUrl
        a.download = `${artist} - ${title}.${audioOnly ? "mp3" : "mp4"}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        toast({
          title: "Download Started",
          description: `${artist} - ${title} is being downloaded.`,
        })
      } else {
        throw new Error("No download URL returned")
      }
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: "There was an error downloading this track. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Download Music</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Download from YouTube</CardTitle>
          <CardDescription>Enter a YouTube URL or video ID to download music</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-2">
              <Input placeholder="YouTube URL or video ID" value={url} onChange={(e) => setUrl(e.target.value)} />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="audio-only" checked={audioOnly} onCheckedChange={setAudioOnly} />
              <Label htmlFor="audio-only">Audio only (MP3)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((result) => (
            <Card key={result.videoId}>
              <CardHeader>
                <CardTitle className="truncate">{result.title}</CardTitle>
                <CardDescription>{result.artist}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <img
                    src={result.thumbnailUrl || "/placeholder.svg"}
                    alt={result.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleDownload(result.videoId, result.title, result.artist)}
                  disabled={isDownloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Downloading..." : `Download ${audioOnly ? "MP3" : "MP4"}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CopyrightWarningModal isOpen={isWarningOpen} onClose={handleClose} onProceed={handleProceed} />
    </div>
  )
}

