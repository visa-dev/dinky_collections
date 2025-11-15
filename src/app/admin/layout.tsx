"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;
		if (!session || (session.user as any)?.role !== "ADMIN") {
			router.push("/login?redirect=/admin");
		}
	}, [session, status, router]);

	if (status === "loading") {
		return (
			<div className="min-h-dvh flex items-center justify-center">
				<div>Loading...</div>
			</div>
		);
	}

	if (!session || (session.user as any)?.role !== "ADMIN") {
		return null;
	}

	return (
		<div className="grid lg:grid-cols-[240px_1fr] min-h-dvh">
			<aside className="border-r border-gold/20 p-6 bg-white/50">
				<div className="h1 text-xl mb-6">Admin</div>
				<nav className="space-y-2">
					<Link href="/admin" className="block hover:text-gold transition-colors">
						Dashboard
					</Link>
					<Link href="/admin/products" className="block hover:text-gold transition-colors">
						Products
					</Link>
					<Link href="/admin/categories" className="block hover:text-gold transition-colors">
						Categories
					</Link>
				</nav>
				<div className="mt-8 pt-8 border-t border-gold/20">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-gold transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Site
					</Link>
				</div>
			</aside>
			<main className="bg-beige/30">{children}</main>
		</div>
	);
}
