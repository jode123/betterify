import fs from "fs"
import path from "path"

// Define the data directory path
const DATA_DIR = path.join(process.cwd(), "data")

// Initialize data directory
export function initDataDir(): void {
  try {
    // Ensure the data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch (error) {
    console.error("Failed to initialize data directory:", error)
  }
}

// Export the data directory path
export const dataDir = DATA_DIR

