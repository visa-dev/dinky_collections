import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;
				const user = await prisma.user.findFirst({ where: { email: credentials.email } });
				if (!user || !user.passwordHash) return null;
				const match = await bcrypt.compare(credentials.password, user.passwordHash);
				if (!match) return null;
				// Allow both ADMIN and USER roles to login
				// Admins can access admin panel, users can shop
				return {
					id: user.id,
					email: user.email ?? undefined,
					name: user.name ?? undefined,
					image: user.image ?? undefined,
					role: user.role,
				};
			},
		}),
	],
	session: { strategy: "jwt" },
	pages: {
		// custom pages can be added later
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = (user as any).role;
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token) {
				(session.user as any).role = token.role;
				(session.user as any).id = token.id;
			}
			return session;
		},
	},
	// Configure cookies/domains later if needed
	secret: process.env.NEXTAUTH_SECRET,
};

