"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import AuthButton from "./AuthButton";
import { useState } from "react";

export default function HeaderClient() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gold/20 shadow-sm">
			<div className="container flex h-16 md:h-20 items-center justify-between">
				<Link href="/" className="h1 text-2xl md:text-3xl hover:opacity-80 transition-opacity">
					Dinky's Collection
				</Link>
				<nav className="hidden md:flex items-center gap-8">
					<Link href="/products" className="text-sm font-medium hover:text-gold transition-colors">
						Shop
					</Link>
					<Link href="/about" className="text-sm font-medium hover:text-gold transition-colors">
						About
					</Link>
					<Link href="/admin" className="text-sm font-medium hover:text-gold transition-colors">
						Admin
					</Link>
					<AuthButton />
				</nav>
				<div className="flex items-center gap-4 md:hidden">
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="p-2"
					>
						<Menu className="w-5 h-5" />
					</button>
				</div>
			</div>
			{mobileMenuOpen && (
				<div className="md:hidden border-t border-gold/20 bg-white/95 backdrop-blur-md">
					<nav className="container py-4 space-y-3">
						<Link
							href="/products"
							className="block text-sm font-medium hover:text-gold transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							Shop
						</Link>
						<Link
							href="/about"
							className="block text-sm font-medium hover:text-gold transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							About
						</Link>
						<Link
							href="/admin"
							className="block text-sm font-medium hover:text-gold transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							Admin
						</Link>
						<div className="pt-3 border-t border-gold/10">
							<AuthButton />
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}
