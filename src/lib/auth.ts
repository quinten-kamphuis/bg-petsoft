import NextAuth, { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { authSchema } from './validations'

const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {

        const validatedCredentials = authSchema.safeParse(credentials)
        if (!validatedCredentials.success) {
          return null;
        }

        const { email, password } = validatedCredentials.data

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          console.log('User not found')
          return null
        }

        const passwordValid = await bcrypt.compare(password, user.hashedPassword)
        if (!passwordValid) {
          console.log('Invalid password')
          return null
        }
        
        return user
      }
    })
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      const isLoggedIn = !!auth
      const isPrivate = request.nextUrl.pathname.includes('/app')
      const hasAccess = isLoggedIn && auth.user.hasAccess;

      if (isLoggedIn && !isPrivate && hasAccess) {
        return Response.redirect(new URL('/app/dashboard', request.nextUrl).toString())
      }
      if (isLoggedIn && isPrivate && !hasAccess) {
        return Response.redirect(new URL('/payment', request.nextUrl).toString()) 
      }
      if (isLoggedIn && !isPrivate && !hasAccess) {
        if(request.nextUrl.pathname.includes('/payment')) {
          return true
        }
        return Response.redirect(new URL('/payment', request.nextUrl).toString()) 
      }
      if (isLoggedIn && isPrivate && hasAccess) {
        return true 
      }
      if (!isLoggedIn && isPrivate) {
        return false
      } 
      if (!isLoggedIn && !isPrivate) {
        return true
      }
      return false
    },
    jwt: async ({token, user, trigger}) => {
      if (user && user.id) {
        token.userId = user.id
        token.email = user.email
        token.hasAccess = user.hasAccess
      }

      if (trigger === 'update') {
        const user = await prisma.user.findUnique({
          where: {
            email: token.email as string,
          },
        })
        if (!user) {
          return null
        }
        token.hasAccess = user.hasAccess
      }

      return token
    },
    session: ({session, token}) => {
      session.user.id = token.userId
      session.user.hasAccess = token.hasAccess
      return session
    }
  },
} satisfies NextAuthConfig

export const { auth, signIn, signOut, handlers: {GET, POST} } = NextAuth(config)