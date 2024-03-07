import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import authConfig from "@/auth.config";

import { getUserById } from "@/data/user";
import { db } from "./lib/db";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.username = token.username as string;
        session.user.email = token.email as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;


      token.username = existingUser.username;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
