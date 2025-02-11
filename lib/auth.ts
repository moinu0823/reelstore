import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOption: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    await connectToDatabase();

                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        return null; // Returning null instead of throwing an error
                    }

                    const isValidPass = await bcrypt.compare(credentials.password, user.password);

                    if (!isValidPass) {
                        return null; // Avoids exposing password mismatch error
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Authorization Error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in .env
};
