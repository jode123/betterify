import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fileName = searchParams.get("fileName")

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 })
    }

    const filePath = join(process.cwd(), "downloads", fileName)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileContent = await readFile(filePath)
    const fileExtension = fileName.split(".").pop()?.toLowerCase()

    let contentType = "application/octet-stream"
    if (fileExtension === "mp3") {
      contentType = "audio/mpeg"
    } else if (fileExtension === "mp4") {
      contentType = "video/mp4"
    }

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("File serving error:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}

