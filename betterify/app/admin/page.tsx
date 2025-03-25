"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2, Shield, User, Clock, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UserData {
  id: string
  name: string | null
  email: string | null
  role: string
  emailVerified: string | null
  image: string | null
}

interface AdminLogEntry {
  timestamp: string
  action: string
  userId: string
  ip: string
  path: string
  details?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [logs, setLogs] = useState<AdminLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [logsLoading, setLogsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin - in a real app, this would check the session
    // For now, we'll just set it to true
    setIsAdmin(true)

    if (isAdmin) {
      fetchUsers()
      fetchLogs()
    } else {
      router.push("/unauthorized")
    }
  }, [router])

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (isAdmin) {
        fetchUsers()
        fetchLogs()
        setLastRefresh(new Date())
      }
    }, 30000) // 30 seconds

    return () => clearInterval(refreshInterval)
  }, [isAdmin])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setUsers(data)
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    try {
      setLogsLoading(true)
      const response = await fetch("/api/admin/logs", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setLogs(data)
    } catch (err: any) {
      console.error("Error fetching logs:", err)
      // Don't set the main error state for logs
    } finally {
      setLogsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    // Add a security confirmation with a random code
    const confirmationCode = Math.floor(1000 + Math.random() * 9000)
    const userConfirmation = prompt(
      `This action cannot be undone. Please type ${confirmationCode} to confirm deletion:`,
    )

    if (userConfirmation !== confirmationCode.toString()) {
      alert("Deletion cancelled: Confirmation code did not match")
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      // Refresh the user list and logs
      fetchUsers()
      fetchLogs()
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin"

    // Add a security confirmation for promoting to admin
    if (newRole === "admin") {
      const confirmationCode = Math.floor(1000 + Math.random() * 9000)
      const userConfirmation = prompt(
        `You are about to grant ADMIN privileges. Please type ${confirmationCode} to confirm:`,
      )

      if (userConfirmation !== confirmationCode.toString()) {
        alert("Action cancelled: Confirmation code did not match")
        return
      }
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update user role")
      }

      // Refresh the user list and logs
      fetchUsers()
      fetchLogs()
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  if (loading && logsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container max-w-4xl py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Secure administration panel</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Last refreshed: {lastRefresh.toLocaleTimeString()}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchUsers()
              fetchLogs()
              setLastRefresh(new Date())
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">
            <User className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Clock className="h-4 w-4 mr-2" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {user.image ? (
                                <img
                                  src={user.image || "/placeholder.svg"}
                                  alt={user.name || "User"}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  <User className="h-4 w-4" />
                                </div>
                              )}
                              <span>{user.name || "Unnamed User"}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email || "No email"}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "outline"}>
                              {user.role === "admin" ? <Shield className="h-3 w-3 mr-1" /> : null}
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleToggleAdmin(user.id, user.role)}>
                                {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={user.id === "admin"}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent administrative actions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No activity logs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        logs.map((log, index) => (
                          <TableRow key={index}>
                            <TableCell className="whitespace-nowrap">{formatTimestamp(log.timestamp)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  log.action.includes("ATTEMPT") || log.action.includes("UNAUTHORIZED")
                                    ? "destructive"
                                    : "default"
                                }
                              >
                                {log.action}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{log.userId}</TableCell>
                            <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              <span title={log.details}>{log.details}</span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

