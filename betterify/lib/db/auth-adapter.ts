import type { Adapter } from "next-auth/adapters"
import { db } from "./index"

export function CustomAdapter(): Adapter {
  return {
    createUser: async (user) => {
      return await db.user.create({
        data: {
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: "user", // Default role for new users
        },
      })
    },
    getUser: async (id) => {
      return await db.user.findUnique({ where: { id } })
    },
    getUserByEmail: async (email) => {
      return await db.user.findUnique({ where: { email } })
    },
    getUserByAccount: async ({ provider, providerAccountId }) => {
      const account = await db.account.findFirst({
        where: { provider, providerAccountId },
      })
      if (!account) return null
      return await db.user.findUnique({ where: { id: account.userId } })
    },
    updateUser: async ({ id, ...userData }) => {
      return await db.user.update({
        where: { id },
        data: userData,
      })
    },
    deleteUser: async (userId) => {
      return await db.user.delete({ where: { id: userId } })
    },
    linkAccount: async (account) => {
      return await db.account.create({
        data: {
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },
    unlinkAccount: async ({ provider, providerAccountId }) => {
      return await db.account.delete({
        where: { provider, providerAccountId },
      })
    },
    createSession: async (session) => {
      return await db.session.create({
        data: {
          userId: session.userId,
          expires: session.expires.toISOString(),
          sessionToken: session.sessionToken,
        },
      })
    },
    getSessionAndUser: async (sessionToken) => {
      const session = await db.session.findUnique({
        where: { sessionToken },
      })
      if (!session) return null

      const user = await db.user.findUnique({
        where: { id: session.userId },
      })
      if (!user) return null

      return {
        session: {
          ...session,
          expires: new Date(session.expires),
        },
        user,
      }
    },
    updateSession: async ({ sessionToken, ...data }) => {
      return await db.session.update({
        where: { sessionToken },
        data: {
          ...data,
          ...(data.expires && { expires: data.expires.toISOString() }),
        },
      })
    },
    deleteSession: async (sessionToken) => {
      return await db.session.delete({
        where: { sessionToken },
      })
    },
    createVerificationToken: async (verificationToken) => {
      return await db.verificationToken.create({
        data: {
          ...verificationToken,
          expires: verificationToken.expires.toISOString(),
        },
      })
    },
    useVerificationToken: async ({ identifier, token }) => {
      const verificationToken = await db.verificationToken.findUnique({
        where: { identifier, token },
      })

      if (!verificationToken) return null

      await db.verificationToken.delete({
        where: { token },
      })

      return {
        ...verificationToken,
        expires: new Date(verificationToken.expires),
      }
    },
  }
}

