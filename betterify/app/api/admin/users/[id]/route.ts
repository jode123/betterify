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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { role } = await request.json()

    // In a real app, you would update the user in your database
    // For now, we'll just log the action

    const ip = request.headers.get("x-forwarded-for") || "unknown"
    logAdminAction({
      action: "UPDATE_USER_ROLE",
      userId: "admin", // In a real app, get this from the session
      ip,
      path: `/api/admin/users/${id}`,
      details: `Admin updated user ${id} role to ${role}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In a real app, you would delete the user from your database
    // For now, we'll just log the action

    const ip = request.headers.get("x-forwarded-for") || "unknown"
    logAdminAction({
      action: "DELETE_USER",
      userId: "admin", // In a real app, get this from the session
      ip,
      path: `/api/admin/users/${id}`,
      details: `Admin deleted user ${id}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

