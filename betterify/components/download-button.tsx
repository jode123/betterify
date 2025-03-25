"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { CopyrightWarningModal } from "@/components/copyright-warning-modal"
import { useToast } from "@/hooks/use-toast"

interface DownloadButtonProps {
  videoId: string
  title: string
  artist: string
  audioOnly?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function DownloadButton({
  videoId,
  title,
  artist,
  audioOnly = true,
  variant = "outline",
  size = "default",
  className,
}: DownloadButtonProps) {
  const [showWarning, setShowWarning] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownloadClick = useCallback(() => {
    setShowWarning(true)
  }, [])

  const handleProceedWithDownload = useCallback(async () => {
    setIsDownloading(true)
    setShowWarning(false)

    try {
      toast({
        title: "Download Started",
        description: "Your download has started. This may take a moment.",
      })

      const response = await fetch(
        `/api/download?videoId=${videoId}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(
          artist,
        )}&audioOnly=${audioOnly}`,
      )

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Download Complete",
          description: "Your download has completed successfully.",
        })

        // Create a temporary link to download the file
        const link = document.createElement("a")
        link.href = data.downloadUrl
        link.download = data.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        throw new Error(data.error || "Download failed")
      }
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Error",
        description: "Failed to download this track. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }, [videoId, title, artist, audioOnly, toast])

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleDownloadClick}
        disabled={isDownloading}
      >
        {size === "icon" ? (
          <Download size={16} />
        ) : (
          <>
            <Download size={16} className="mr-2" />
            {isDownloading ? "Downloading..." : "Download"}
          </>
        )}
      </Button>

      <CopyrightWarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        onProceed={handleProceedWithDownload}
      />
    </>
  )
}

