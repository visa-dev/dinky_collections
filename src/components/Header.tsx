"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import AuthButton from "./AuthButton";

export default function Header() {
	const { getItemCount } = useCart();
	const count = getItemCount();

	return (
		<header className="border-b border-gold/30">
			<div className="container flex h-16 items-center justify-between">
				<Link href="/" className="h1 text-2xl">
					Dinky's Collection
				</Link>
				<nav className="flex items-center gap-6">
					<Link href="/products" className="hover:text-gold">
						Shop
					</Link>
					<Link href="/about" className="hover:text-gold">
						About
					</Link>
					<Link href="/admin" className="hover:text-gold">
						Admin
					</Link>
					<Link href="/cart" className="relative hover:text-gold">
						<ShoppingCart className="w-5 h-5" />
						{count > 0 && (
							<span className="absolute -top-2 -right-2 bg-gold text-charcoal text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
								{count}
							</span>
						)}
					</Link>
					<AuthButton />
				</nav>
			</div>
		</header>
	);
}

