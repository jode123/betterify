import fs from "fs"
import path from "path"

// Define the database directory
const DB_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DB_DIR, "users.json")
const ACCOUNTS_FILE = path.join(DB_DIR, "accounts.json")
const SESSIONS_FILE = path.join(DB_DIR, "sessions.json")
const VERIFICATION_TOKENS_FILE = path.join(DB_DIR, "verification-tokens.json")

// Ensure the database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

// Initialize files if they don't exist
const initializeFile = (filePath: string, defaultContent: any = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2))
  }
}

// Initialize all database files
initializeFile(USERS_FILE)
initializeFile(ACCOUNTS_FILE)
initializeFile(SESSIONS_FILE)
initializeFile(VERIFICATION_TOKENS_FILE)

// Helper functions to read and write data
export const readData = <T>(filePath: string): T => {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data) as T
  } catch (error: any) {
    console.error(`Error reading from ${filePath}:`, error)
    return [] as unknown as T
  }
}

export const writeData = <T>(filePath: string, data: T): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error: any) {
    console.error(`Error writing to ${filePath}:`, error)
  }
}

// User types
export interface User {
  id: string
  name?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
  role?: 'user' | 'admin'
  userData?: string | null // JSON string for user data
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
  expires: string // ISO date string
}

export interface VerificationToken {
  identifier: string
  token: string
  expires: string // ISO date string
}

// Database operations
export const db = {
  // User operations
  user: {
    findUnique: async ({ where }: { where: { id?: string; email?: string } }) => {
      const users = readData<User[]>(USERS_FILE)
      if (where.id) {
        return users.find(user => user.id === where.id) || null
      }
      if (where.email) {
        return users.find(user => user.email === where.email) || null
      }
      return null
    },
    findMany: async () => {
      return readData<User[]>(USERS_FILE)
    },
    create: async ({ data }: { data: Omit<User, 'id'> }) => {
      const users = readData<User[]>(USERS_FILE)
      const newUser: User = { id: uuidv4(), ...data }
      users.push(newUser)
      writeData(USERS_FILE, users)
      return newUser
    },
    update: async ({ where, data }: { where: { id: string }, data: Partial<User> }) => {
      const users = readData<User[]>(USERS_FILE)
      const userIndex = users.findIndex(user => user.id === where.id)
      if (userIndex === -1) return null
      
      const updatedUser = { ...users[userIndex], ...data }
      users[userIndex] = updatedUser
      writeData(USERS_FILE, users)
      return updatedUser
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const users = readData<User[]>(USERS_FILE)
      const userIndex = users.findIndex(user => user.id === where.id)
      if (userIndex === -1) return null
      
      const deletedUser = users[userIndex]
      users.splice(userIndex, 1)
      writeData(USERS_FILE, users)
      
      // Also delete related accounts and sessions
      const accounts = readData<Account[]>(ACCOUNTS_FILE)
      const filteredAccounts = accounts.filter(account => account.userId !== where.id)
      writeData(ACCOUNTS_FILE, filteredAccounts)
      
      const sessions = readData<Session[]>(SESSIONS_FILE)
      const filteredSessions = sessions.filter(session => session.userId !== where.id)
      writeData(SESSIONS_FILE, filteredSessions)
      
      return deletedUser
    }
  },
  
  // Account operations
  account: {
    findFirst: async ({ where }: { where: { provider: string; providerAccountId: string } }) => {
      const accounts = readData<Account[]>(ACCOUNTS_FILE)
      return accounts.find(
        account => account.provider === where.provider && 
                  account.providerAccountId === where.providerAccountId
      ) || null
    },
    create: async ({ data }: { data: Omit<Account, 'id'> }) => {
      const accounts = readData<Account[]>(ACCOUNTS_FILE)
      const newAccount: Account = { id: uuidv4(), ...data }
      accounts.push(newAccount)
      writeData(ACCOUNTS_FILE, accounts)
      return newAccount
    },
    delete: async ({ where }: { where: { provider: string; providerAccountId: string } }) => {
      const accounts = readData<Account[]>(ACCOUNTS_FILE)
      const accountIndex = accounts.findIndex(
        account => account.provider === where.provider && 
                  account.providerAccountId === where.providerAccountId
      )
      if (accountIndex === -1) return null
      
      const deletedAccount = accounts[accountIndex]
      accounts.splice(accountIndex, 1)
      writeData(ACCOUNTS_FILE, accounts)
      return deletedAccount
    }
  },
  
  // Session operations
  session: {
    findUnique: async ({ where }: { where: { sessionToken: string } }) => {
      const sessions = readData<Session[]>(SESSIONS_FILE)
      return sessions.find(session => session.sessionToken === where.sessionToken) || null
    },
    findMany: async ({ where }: { where: { userId: string } }) => {
      const sessions = readData<Session[]>(SESSIONS_FILE)
      return sessions.filter(session => session.userId === where.userId)
    },
    create: async ({ data }: { data: Omit<Session, 'id'> }) => {
      const sessions = readData<Session[]>(SESSIONS_FILE)
      const newSession: Session = { id: uuidv4(), ...data }
      sessions.push(newSession)
      writeData(SESSIONS_FILE, sessions)
      return newSession
    },
    update: async ({ where, data }: { where: { sessionToken: string }, data: Partial<Session> }) => {
      const sessions = readData<Session[]>(SESSIONS_FILE)
      const sessionIndex = sessions.findIndex(session => session.sessionToken === where.sessionToken)
      if (sessionIndex === -1) return null
      
      const updatedSession = { ...sessions[sessionIndex], ...data }
      sessions[sessionIndex] = updatedSession
      writeData(SESSIONS_FILE, sessions)
      return updatedSession
    },
    delete: async ({ where }: { where: { sessionToken: string } }) => {
      const sessions = readData<Session[]>(SESSIONS_FILE)
      const sessionIndex = sessions.findIndex(session => session.sessionToken === where.sessionToken)
      if (sessionIndex === -1) return null
      
      const deletedSession = sessions[sessionIndex]
      sessions.splice(sessionIndex, 1)
      writeData(SESSIONS_FILE, sessions)
      return deletedSession
    }
  },
  
  // Verification token operations
  verificationToken: {
    findUnique: async ({ where }: { where: { token: string } | { identifier: string; token: string } }) => {
      const tokens = readData<VerificationToken[]>(VERIFICATION_TOKENS_FILE)
      if ('token' in where && 'identifier' in where) {
        return tokens.find(
          token => token.token === where.token && token.identifier === where.identifier
        ) || null
      }
      return tokens.find(token => token.token === where.token) || null
    },
    create: async ({ data }: { data: VerificationToken }) => {
      const tokens = readData<VerificationToken[]>(VERIFICATION_TOKENS_FILE)
      tokens.push(data)
      writeData(VERIFICATION_TOKENS_FILE, tokens)
      return data
    },
    delete: async ({ where }: { where: { token: string } }) => {
      const tokens = readData<VerificationToken[]>(VERIFICATION_TOKENS_FILE)
      const tokenIndex = tokens.findIndex(token => token.token === where.token)
      if (tokenIndex === -1) return null
      
      const deletedToken = tokens[tokenIndex]
      tokens.splice(tokenIndex, 1)
      writeData(VERIFICATION_TOKENS_FILE, tokens)
      return deletedToken
    }
  }
}

// Create an admin user if none exists
export const ensureAdminExists = async () => {
  const users = readData<User[]>(USERS_FILE)
  const adminExists = users.some(user => user.role === 'admin')
  
  if (!adminExists) {
    const adminUser: User = {
      id: uuidv4(),
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      emailVerified: new Date().toISOString() as unknown as Date
    }
    users.push(adminUser)
    writeData(USERS_FILE, users)
    console.log('Admin user created:', adminUser.email)
  }
}

// Initialize admin user
ensureAdminExists()

