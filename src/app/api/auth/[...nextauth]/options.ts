import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createConnection } from '@/lib/dbConnect'
import bcrypt from 'bcrypt'

// Validate environment variables
const GOOGLE_ID = process.env.GOOGLE_ID
const GOOGLE_SECRET = process.env.GOOGLE_SECRET

if (!GOOGLE_ID || !GOOGLE_SECRET) {
  throw new Error('Missing GOOGLE_ID or GOOGLE_SECRET in environment variables')
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'email profile',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email', type: 'text', placeholder: 'Enter your email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
      },
      async authorize(credentials) {
        const connection = await createConnection()
        try {
          const [users] = await connection.query(`SELECT * FROM users WHERE email = ?`, [
            credentials?.identifier,
          ])

          if (!users.length) {
            throw new Error('No user found with that email')
          }

          const user = users[0]

          // Check password validity
          const isValidPassword = await bcrypt.compare(credentials?.password, user.password)
          if (!isValidPassword) {
            throw new Error('Invalid password')
          }

          // If all checks pass, return the user object with additional details
          return { id: user.id, email: user.email, username: user.username, isAdmin: user.isAdmin }
        } catch (error) {
          console.error('Authorize Error:', error)
          return null // Return null if there's an error
        }
        // } finally {
        //   await connection.end()
        // }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        return profile?.email_verified && profile?.email.endsWith('@example.com')
      }
      return true
    },
    async session({ session, token }) {
      // Add username and isAdmin to the session object
      session.user.id = token.id
      session.user.username = token.username
      session.user.isAdmin = token.isAdmin
      return session
    },
    async jwt({ token, user }) {
      // Store username and isAdmin in the token
      if (user) {
        token.id = user.id
        token.username = user.username
        token.isAdmin = user?.isAdmin
      }
      return token
    },
  },
}
