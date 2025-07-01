import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./lib/zod";
import bcrypt from "bcryptjs";

export const authOptions = {
  trustHost: true, // Trust the host for NextAuth
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials
      ({
        name: "Credentials",
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
          const validation = loginSchema.safeParse(credentials);

          if (!validation.success) {
            const formattedErrors = {};
            validation.error.errors.forEach((err) => {
              formattedErrors[err.path[0]] = err.message;
            });
            throw new Error(JSON.stringify(formattedErrors));
          }

          const { email, password } = validation.data;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            throw new Error("No user found with this email or password not set");
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);

          if (!isValidPassword) {
            throw new Error("Invalid email or password");
          }

          return user;
        },
      }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
