import { NextResponse } from "next/server"
import { logAdminAction } from "@/lib/admin-logger"

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    role: "user",
    emailVerified: new Date().toISOString(),
    image: "https://avatars.githubusercontent.com/u/1?v=4",
  },
  {
    id: "admin",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    emailVerified: new Date().toISOString(),
    image: null,
  },
  {
    id: "2",
    name: "Test User",
    email: "test@example.com",
    role: "user",
    emailVerified: null,
    image: null,
  },
]

export async function GET(request: Request) {
  try {
    // In a real app, you would fetch users from your database
    // For now, we'll return mock data

    // Log the action
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    logAdminAction({
      action: "FETCH_USERS",
      userId: "admin", // In a real app, get this from the session
      ip,
      path: "/api/admin/users",
      details: "Admin fetched user list",
    })

    return NextResponse.json(mockUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

