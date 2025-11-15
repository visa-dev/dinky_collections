"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export default function AuthButton() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <div className="w-5 h-5" />;
	}

	if (session) {
		return (
			<div className="flex items-center gap-3">
				<span className="hidden sm:inline text-sm text-gold/70">
					{session.user?.name || session.user?.email}
				</span>
				<button
					onClick={() => signOut()}
					className="flex items-center gap-2 hover:text-gold"
					title="Sign out"
				>
					<LogOut className="w-5 h-5" />
					<span className="hidden sm:inline">Sign Out</span>
				</button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-3">
			<Link
				href="/signup"
				className="text-sm hover:text-gold hidden sm:inline"
			>
				Sign Up
			</Link>
			<Link
				href="/login"
				className="flex items-center gap-2 hover:text-gold"
				title="Sign in"
			>
				<User className="w-5 h-5" />
				<span className="hidden sm:inline">Sign In</span>
			</Link>
		</div>
	);
}

