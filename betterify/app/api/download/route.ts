import { type NextRequest, NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

// Create a downloads directory if it doesn't exist
const ensureDownloadsDir = async () => {
  const downloadsDir = join(process.cwd(), "downloads")
  if (!existsSync(downloadsDir)) {
    await mkdir(downloadsDir, { recursive: true })
  }
  return downloadsDir
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const videoId = searchParams.get("videoId")
    const audioOnly = searchParams.get("audioOnly") === "true"
    const title = searchParams.get("title") || "download"
    const artist = searchParams.get("artist") || "unknown"

    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
    }

    // Generate a unique filename
    const fileId = uuidv4().slice(0, 8)
    const fileName = `${artist.replace(/[^a-z0-9]/gi, "_")}_${title.replace(/[^a-z0-9]/gi, "_")}_${fileId}`
    const fileExt = audioOnly ? "mp3" : "mp4"
    const outputFileName = `${fileName}.${fileExt}`

    // Create the downloads directory
    const downloadsDir = await ensureDownloadsDir()
    const outputPath = join(downloadsDir, outputFileName)

    // Simulate a download process (in a real app, you'd use ytdl-core or a similar library)
    // For this example, we'll just create a placeholder file
    await writeFile(outputPath, "This is a placeholder file for demonstration purposes.")

    // In a real implementation, you would use something like:
    // const ytdlCommand = audioOnly
    //   ? `yt-dlp -x --audio-format mp3 -o "${outputPath}" "https://www.youtube.com/watch?v=${videoId}"`
    //   : `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]" -o "${outputPath}" "https://www.youtube.com/watch?v=${videoId}"`
    // await execAsync(ytdlCommand)

    // Return the download URL
    const downloadUrl = `/api/download/file?fileName=${encodeURIComponent(outputFileName)}`

    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName: outputFileName,
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 })
  }
}

