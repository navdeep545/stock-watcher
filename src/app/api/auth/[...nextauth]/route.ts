// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { createOrUpdateUser } from "@/app/lib/db/user";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,  // Add this line
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        try {
          await createOrUpdateUser(user.email, user.name ?? null);
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return false;
    },
    async session({ session }) {
      return session;
    },
  },
});

export { handler as GET, handler as POST };