import { authOptin } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptin);

export{ handler as GET, handler as POST};