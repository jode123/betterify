import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Define the log file path
const LOG_DIR = path.join(process.cwd(), "data")
const LOG_FILE = path.join(LOG_DIR, "admin-logs.json")

// Define the log entry interface
interface AdminLogEntry {
  id: string
  timestamp: string
  action: string
  userId: string
  ip: string
  path: string
  details?: string
}

// Initialize log file
function initLogFile(): void {
  try {
    // Ensure the log directory exists
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true })
    }

    // Create log file if it doesn't exist
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2), "utf8")
    }
  } catch (error) {
    console.error("Failed to initialize log file:", error)
  }
}

// Log admin action
export function logAdminAction(entry: Omit<AdminLogEntry, "id" | "timestamp">): void {
  try {
    // Initialize log file if needed
    initLogFile()

    // Read existing logs
    const logsData = fs.readFileSync(LOG_FILE, "utf8")
    const logs: AdminLogEntry[] = JSON.parse(logsData)

    // Create new log entry
    const newEntry: AdminLogEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...entry,
    }

    // Add new entry to logs
    logs.unshift(newEntry)

    // Limit logs to 1000 entries
    const limitedLogs = logs.slice(0, 1000)

    // Write updated logs to file
    fs.writeFileSync(LOG_FILE, JSON.stringify(limitedLogs, null, 2), "utf8")
  } catch (error) {
    console.error("Error logging admin action:", error)
  }
}

// Get admin logs
export function getAdminLogs(limit = 100): AdminLogEntry[] {
  try {
    // Initialize log file if needed
    initLogFile()

    // Read logs from file
    const logsData = fs.readFileSync(LOG_FILE, "utf8")
    const logs: AdminLogEntry[] = JSON.parse(logsData)

    // Return limited logs
    return logs.slice(0, limit)
  } catch (error) {
    console.error("Error reading admin logs:", error)
    return []
  }
}

