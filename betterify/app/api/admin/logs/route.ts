import { NextResponse } from "next/server"
import { getAdminLogs, logAdminAction } from "@/lib/admin-logger"

export async function GET(request: Request) {
  try {
    // Get admin logs
    const logs = getAdminLogs(100) // Get the last 100 logs

    // Log the action
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    logAdminAction({
      action: "FETCH_LOGS",
      userId: "admin", // In a real app, get this from the session
      ip,
      path: "/api/admin/logs",
      details: "Admin fetched activity logs",
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}

