
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z from "zod";
import prisma from '@/lib/prisma/prisma'
import bcrypt from 'bcrypt';
import { PrismaAdapter } from "@auth/prisma-adapter"

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-account",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = z.object(
          {
            email: z.email(),
            password: z.string().min(6)
          }
        ).safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findFirst({ where: { email: email } });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (isPasswordValid) {
          const { password, ...rest } = user;
          return rest;
        }
        return null;
      }
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, credentials, email, profile }) => {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      const userId = user?.id || (token.id as string);
      if (userId) {
        const userFromDB = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (userFromDB) {
          token.roles = userFromDB.roles ?? [];
          token.isActive = userFromDB.isActive;
        }
      }
      return token;
    },
    async session({ session, token }) {

      if( session && session.user ) {
        session.user.roles = token.roles;
        session.user.id = token.id!;
      }
      return session;
    },
    
  },

};

