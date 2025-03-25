import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // For demo purposes, we'll accept a test user
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            name: "Demo User",
            email: "user@example.com",
            image: "https://avatars.githubusercontent.com/u/1?v=4",
            role: "user",
          }
        }

        // Check for admin login
        if (credentials?.email === "admin@example.com" && credentials?.password === "admin") {
          return {
            id: "admin",
            name: "Admin",
            email: "admin@example.com",
            role: "admin",
          }
        }

        return null
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID and role to the session
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = (token.role as string) || "user"
      }
      return session
    },
    async jwt({ token, user }) {
      // Add user ID and role to the token
      if (user) {
        token.sub = user.id
        token.role = user.role || "user"
      }
      return token
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/",
    error: "/sign-in",
    newUser: "/settings",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

