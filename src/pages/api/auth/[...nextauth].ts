/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { env } from "~/env.mjs"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/server/db";
//import { prisma } from "../../../server/db/client";

export const authOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
        clientId:env.GOOGLE_CLIENT,
        clientSecret:env.GOOGLE_SECRET
    })
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)