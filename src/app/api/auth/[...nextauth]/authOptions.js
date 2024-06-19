import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from 'bcryptjs';


export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),

        // oauth done now credentials
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: { label: "email", type: "email", placeholder: "examplegmail.com" },
                password: { label: "password", type: "password", placeholder: "Password" }
            },
            // now the authorize logic 
            async authorize(credentials, req) {

                const { email, password } = credentials;
                const user = await prisma.user.findUnique({
                    where: {
                        email
                    }
                })
                const hashedPassword = user.password;
                const passwordMatch = await bcrypt.compare(password, hashedPassword);

                if (passwordMatch) {
                    return user;
                } else {
                    return null;
                }


            }

        })

    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
          session.user.id = token.id;
          return session;
        },
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
          }
          return token;
        },
      },
    };
    