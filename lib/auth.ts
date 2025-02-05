import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";


export const authOptin : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",

           credentials: {
            email : {label: "Email", type:"text" },
            password: {label: "Password", type: "password"}
           },
           async authorize(credential){
            
            if(!credential?.email || !credential?.password){
                  throw new Error("User not Found")
            }

            try {
                await connectToDatabase();

                const user = await User.findOne({email: credential.email})

                if(!user){
                    throw new Error("user not found with this email")
                }

                const isvaildpass = await bcrypt.compare(credential.password, user.password);

                if(!isvaildpass){
                    throw new Error("please check your password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role
                }

            } catch (error) {
                throw error;
            }
        }
        }),
    ],
     callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({session ,token}){
             if(session.user){
                session.user.id = token.id as String;
                session.user.role = token.role as String; 
             }
             return session;
        },
     },pages:{
        signIn: "/login",
        error: "/login",
     },
     session: {
        strategy: "jwt",
        maxAge: 30 * 24* 60*60,
     },
     secret: process.env.NEXTAUTH_SECRET,
};