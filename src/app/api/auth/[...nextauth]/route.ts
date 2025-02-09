import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { createOrUpdateUser, getUserByEmail } from "@/app/lib/db/user";
import { User } from "@/app/lib/types";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
    } & DefaultSession["user"];
  }
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID || "",
    //   clientSecret: process.env.GOOGLE_SECRET || "",
    // }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("🔹 Sign-in attempt:", {
        hasEmail: !!user.email,
        userName: user.name,
      });

      if (!user.email) {
        console.log("❌ Denying access - no email found");
        return false;
      }

      try {
        // Ensure user exists in DB
        const dbUser = await createOrUpdateUser(user.email, user.name ?? null);
        console.log("✅ User signed in:", dbUser);
        return true;
      } catch (error) {
        console.error("❌ Error in createOrUpdateUser:", error);
        return false; // Prevent login on database errors
      }
    },

    async session({ session }) {
      if (!session.user?.email) return session;

      try {
        const dbUser: User | null = await getUserByEmail(session.user.email);
        if (dbUser) {
          session.user = {
            ...session.user,
            user_id: dbUser.user_id, // Attach user_id to session
            name: dbUser.name,
          };
        }
      } catch (error) {
        console.error("❌ Error fetching user session data:", error);
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
