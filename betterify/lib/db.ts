import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Define the database directory
const DB_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DB_DIR, "users.json")
const ACCOUNTS_FILE = path.join(DB_DIR, "accounts.json")
const SESSIONS_FILE = path.join(DB_DIR, "sessions.json")
const VERIFICATION_TOKENS_FILE = path.join(DB_DIR, "verification-tokens.json")

// Ensure the database directory exists
try {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }

  // Create files if they don't exist
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8")
  }

  if (!fs.existsSync(ACCOUNTS_FILE)) {
    fs.writeFileSync(ACCOUNTS_FILE, "[]", "utf8")
  }

  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, "[]", "utf8")
  }

  if (!fs.existsSync(VERIFICATION_TOKENS_FILE)) {
    fs.writeFileSync(VERIFICATION_TOKENS_FILE, "[]", "utf8")
  }
} catch (error) {
  console.error("Failed to initialize database:", error)
}

// Define types
export interface User {
  id: string
  name?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
  password?: string | null
  role?: string
  spotifyId?: string | null
  spotifyAccessToken?: string | null
  spotifyRefreshToken?: string | null
  spotifyTokenExpiry?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string | null
  access_token?: string | null
  expires_at?: number | null
  token_type?: string | null
  scope?: string | null
  id_token?: string | null
  session_state?: string | null
}

export interface Session {
  id: string
  sessionToken: string
  userId: string
  expires: Date
}

export interface VerificationToken {
  identifier: string
  token: string
  expires: Date
}

// Helper functions to read and write data
function readData<T>(filePath: string): T[] {
  try {
    const data = fs.readFileSync(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading from ${filePath}:`, error)
    return []
  }
}

function writeData<T>(filePath: string, data: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error)
  }
}

// Database operations
export const db = {
  // User operations
  user: {
    create: async (data: Partial<User>): Promise<User> => {
      const users = readData<User>(USERS_FILE)

      const newUser: User = {
        id: data.id || uuidv4(),
        name: data.name || null,
        email: data.email || null,
        emailVerified: data.emailVerified || null,
        image: data.image || null,
        password: data.password || null,
        role: data.role || "user",
        spotifyId: data.spotifyId || null,
        spotifyAccessToken: data.spotifyAccessToken || null,
        spotifyRefreshToken: data.spotifyRefreshToken || null,
        spotifyTokenExpiry: data.spotifyTokenExpiry || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      users.push(newUser)
      writeData(USERS_FILE, users)

      return newUser
    },

    findUnique: async ({ where }: { where: Partial<User> }): Promise<User | null> => {
      const users = readData<User>(USERS_FILE)

      const user = users.find((user) => {
        return Object.entries(where).every(([key, value]) => {
          return user[key as keyof User] === value
        })
      })

      return user || null
    },

    findMany: async (options?: { where?: Partial<User> }): Promise<User[]> => {
      const users = readData<User>(USERS_FILE)

      if (!options?.where) {
        return users
      }

      return users.filter((user) => {
        return Object.entries(options.where!).every(([key, value]) => {
          return user[key as keyof User] === value
        })
      })
    },

    update: async ({ where, data }: { where: Partial<User>; data: Partial<User> }): Promise<User> => {
      const users = readData<User>(USERS_FILE)

      const index = users.findIndex((user) => {
        return Object.entries(where).every(([key, value]) => {
          return user[key as keyof User] === value
        })
      })

      if (index === -1) {
        throw new Error("User not found")
      }

      const updatedUser = {
        ...users[index],
        ...data,
        updatedAt: new Date(),
      }

      users[index] = updatedUser
      writeData(USERS_FILE, users)

      return updatedUser
    },

    delete: async ({ where }: { where: Partial<User> }): Promise<User> => {
      const users = readData<User>(USERS_FILE)

      const index = users.findIndex((user) => {
        return Object.entries(where).every(([key, value]) => {
          return user[key as keyof User] === value
        })
      })

      if (index === -1) {
        throw new Error("User not found")
      }

      const deletedUser = users[index]
      users.splice(index, 1)
      writeData(USERS_FILE, users)

      return deletedUser
    },
  },

  // Account operations
  account: {
    create: async (data: Partial<Account>): Promise<Account> => {
      const accounts = readData<Account>(ACCOUNTS_FILE)

      const newAccount: Account = {
        id: data.id || uuidv4(),
        userId: data.userId!,
        type: data.type!,
        provider: data.provider!,
        providerAccountId: data.providerAccountId!,
        refresh_token: data.refresh_token || null,
        access_token: data.access_token || null,
        expires_at: data.expires_at || null,
        token_type: data.token_type || null,
        scope: data.scope || null,
        id_token: data.id_token || null,
        session_state: data.session_state || null,
      }

      accounts.push(newAccount)
      writeData(ACCOUNTS_FILE, accounts)

      return newAccount
    },

    findFirst: async ({ where }: { where: Partial<Account> }): Promise<Account | null> => {
      const accounts = readData<Account>(ACCOUNTS_FILE)

      const account = accounts.find((account) => {
        return Object.entries(where).every(([key, value]) => {
          return account[key as keyof Account] === value
        })
      })

      return account || null
    },

    findMany: async ({ where }: { where: Partial<Account> }): Promise<Account[]> => {
      const accounts = readData<Account>(ACCOUNTS_FILE)

      return accounts.filter((account) => {
        return Object.entries(where).every(([key, value]) => {
          return account[key as keyof Account] === value
        })
      })
    },

    deleteMany: async ({ where }: { where: Partial<Account> }): Promise<{ count: number }> => {
      const accounts = readData<Account>(ACCOUNTS_FILE)

      const initialLength = accounts.length

      const filteredAccounts = accounts.filter((account) => {
        return !Object.entries(where).every(([key, value]) => {
          return account[key as keyof Account] === value
        })
      })

      writeData(ACCOUNTS_FILE, filteredAccounts)

      return { count: initialLength - filteredAccounts.length }
    },
  },

  // Session operations
  session: {
    create: async (data: Partial<Session>): Promise<Session> => {
      const sessions = readData<Session>(SESSIONS_FILE)

      const newSession: Session = {
        id: data.id || uuidv4(),
        sessionToken: data.sessionToken!,
        userId: data.userId!,
        expires: data.expires!,
      }

      sessions.push(newSession)
      writeData(SESSIONS_FILE, sessions)

      return newSession
    },

    findUnique: async ({ where }: { where: Partial<Session> }): Promise<Session | null> => {
      const sessions = readData<Session>(SESSIONS_FILE)

      const session = sessions.find((session) => {
        return Object.entries(where).every(([key, value]) => {
          return session[key as keyof Session] === value
        })
      })

      return session || null
    },

    findMany: async ({ where }: { where: Partial<Session> }): Promise<Session[]> => {
      const sessions = readData<Session>(SESSIONS_FILE)

      return sessions.filter((session) => {
        return Object.entries(where).every(([key, value]) => {
          return session[key as keyof Session] === value
        })
      })
    },

    update: async ({ where, data }: { where: Partial<Session>; data: Partial<Session> }): Promise<Session> => {
      const sessions = readData<Session>(SESSIONS_FILE)

      const index = sessions.findIndex((session) => {
        return Object.entries(where).every(([key, value]) => {
          return session[key as keyof Session] === value
        })
      })

      if (index === -1) {
        throw new Error("Session not found")
      }

      const updatedSession = {
        ...sessions[index],
        ...data,
      }

      sessions[index] = updatedSession
      writeData(SESSIONS_FILE, sessions)

      return updatedSession
    },

    delete: async ({ where }: { where: Partial<Session> }): Promise<Session> => {
      const sessions = readData<Session>(SESSIONS_FILE)

      const index = sessions.findIndex((session) => {
        return Object.entries(where).every(([key, value]) => {
          return session[key as keyof Session] === value
        })
      })

      if (index === -1) {
        throw new Error("Session not found")
      }

      const deletedSession = sessions[index]
      sessions.splice(index, 1)
      writeData(SESSIONS_FILE, sessions)

      return deletedSession
    },

    deleteMany: async ({ where }: { where: Partial<Session> }): Promise<{ count: number }> => {
      const sessions = readData<Session>(SESSIONS_FILE)

      const initialLength = sessions.length

      const filteredSessions = sessions.filter((session) => {
        return !Object.entries(where).every(([key, value]) => {
          return session[key as keyof Session] === value
        })
      })

      writeData(SESSIONS_FILE, filteredSessions)

      return { count: initialLength - filteredSessions.length }
    },
  },

  // VerificationToken operations
  verificationToken: {
    create: async (data: VerificationToken): Promise<VerificationToken> => {
      const tokens = readData<VerificationToken>(VERIFICATION_TOKENS_FILE)

      const newToken: VerificationToken = {
        identifier: data.identifier,
        token: data.token,
        expires: data.expires,
      }

      tokens.push(newToken)
      writeData(VERIFICATION_TOKENS_FILE, tokens)

      return newToken
    },

    findUnique: async ({ where }: { where: Partial<VerificationToken> }): Promise<VerificationToken | null> => {
      const tokens = readData<VerificationToken>(VERIFICATION_TOKENS_FILE)

      const token = tokens.find((token) => {
        return Object.entries(where).every(([key, value]) => {
          return token[key as keyof VerificationToken] === value
        })
      })

      return token || null
    },

    delete: async ({ where }: { where: Partial<VerificationToken> }): Promise<VerificationToken> => {
      const tokens = readData<VerificationToken>(VERIFICATION_TOKENS_FILE)

      const index = tokens.findIndex((token) => {
        return Object.entries(where).every(([key, value]) => {
          return token[key as keyof VerificationToken] === value
        })
      })

      if (index === -1) {
        throw new Error("Verification token not found")
      }

      const deletedToken = tokens[index]
      tokens.splice(index, 1)
      writeData(VERIFICATION_TOKENS_FILE, tokens)

      return deletedToken
    },
  },
}

// Initialize admin user if it doesn't exist
export async function initAdminUser() {
  try {
    const adminUser = await db.user.findUnique({
      where: { email: "admin@example.com" },
    })

    if (!adminUser) {
      await db.user.create({
        email: "admin@example.com",
        name: "Admin User",
        password: "$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm", // "password"
        role: "admin",
      })
      console.log("Admin user created")
    }
  } catch (error) {
    console.error("Failed to initialize admin user:", error)
  }
}

// Call initAdminUser to ensure an admin user exists
initAdminUser()

