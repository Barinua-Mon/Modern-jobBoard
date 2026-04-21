import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'  // ← add this
import bcrypt from 'bcryptjs'                               // ← add this too

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Google({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
    }),
  ],

  callbacks: {

    async session({ session, user }) {
      if (session.user) {
        session.user.name = user.name
        session.user.image = user.image
        session.user.id = user.id
        session.user.role = user.role   // ← forward role to session
      }
      console.log("session:", session);
      return session
    },

    authorized({ auth, request }) {
      return !!auth?.user
    },
  },

  pages: {
    signIn: "/signin",
  },

})