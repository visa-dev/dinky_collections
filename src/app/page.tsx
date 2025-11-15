import Link from "next/link";
import HeaderClient from "@/components/HeaderClient";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { ArrowRight, Sparkles, Shield, Truck, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

async function getCategories() {
	try {
		return await prisma.category.findMany({ orderBy: { name: "asc" } });
	} catch {
		return [];
	}
}

async function getFeaturedProducts() {
	try {
		return await prisma.product.findMany({
			take: 6,
			orderBy: { createdAt: "desc" },
			include: { images: { orderBy: { index: "asc" }, take: 1 }, category: true },
		});
	} catch {
		return [];
	}
}

export default async function Home() {
	const categories = await getCategories();
	const featuredProducts = await getFeaturedProducts();

	return (
		<div className="min-h-dvh">
			<HeaderClient />

			{/* Hero Section */}
			<section className="container grid md:grid-cols-2 gap-12 py-16 md:py-24 items-center">
				<div className="space-y-6">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20">
						<Sparkles className="w-4 h-4 text-gold" />
						<p className="uppercase tracking-widest text-gold text-xs font-semibold">
							Wear Confidence
						</p>
					</div>
					<h1 className="h1 text-5xl md:text-7xl leading-tight">
						Modern. <span className="gradient-text">Premium.</span> Effortless.
					</h1>
					<p className="text-lg text-charcoal/70 max-w-lg leading-relaxed">
						Elevate your wardrobe with timeless essentials and statement pieces crafted to last.
						Discover quality fashion that reflects your unique style.
					</p>
					<div className="flex flex-wrap gap-4">
						<Link href="/products" className="btn-primary inline-flex items-center gap-2 group">
							Shop Now
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</Link>
						<Link href="#featured" className="btn-secondary">
							Explore Collection
						</Link>
					</div>
				</div>
				<div className="relative aspect-[4/5] rounded-3xl overflow-hidden ring-2 ring-gold/20 shadow-2xl group">
					{/* Hero Background with Beautiful Gradient */}
					<div className="absolute inset-0 bg-gradient-to-br from-gold/40 via-gold/20 to-charcoal/30" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.4),transparent_60%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(28,28,28,0.3),transparent_50%)]" />
					
					{/* Decorative Elements */}
					<div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-gold/20" />
					<div className="absolute bottom-12 left-8 w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm border border-gold/10" />
					
					{/* Content */}
					<div className="absolute inset-0 flex items-center justify-center p-8">
						<div className="text-center space-y-4 z-10">
							<div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-gold/40 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
								<Star className="w-12 h-12 text-gold fill-gold" />
							</div>
							<h3 className="h2 text-3xl md:text-4xl text-white drop-shadow-lg font-bold">
								New Collection
							</h3>
							<p className="text-white/95 text-base md:text-lg drop-shadow font-medium">
								Timeless Style, Modern Elegance
							</p>
							<div className="flex items-center justify-center gap-1 mt-4">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={i} className="w-4 h-4 text-gold fill-gold" />
								))}
							</div>
						</div>
					</div>
					
					{/* Animated overlay on hover */}
					<div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>
			</section>

			{/* Features */}
			<section className="container py-12 border-y border-gold/10">
				<div className="grid md:grid-cols-3 gap-8">
					<div className="flex items-center gap-4">
						<div className="rounded-2xl bg-gold/10 p-4">
							<Truck className="w-6 h-6 text-gold" />
						</div>
						<div>
							<h3 className="font-semibold">Free Shipping</h3>
							<p className="text-sm text-charcoal/60">On orders over Rs. 10,000</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="rounded-2xl bg-gold/10 p-4">
							<Shield className="w-6 h-6 text-gold" />
						</div>
						<div>
							<h3 className="font-semibold">Secure Payment</h3>
							<p className="text-sm text-charcoal/60">100% secure checkout</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="rounded-2xl bg-gold/10 p-4">
							<Sparkles className="w-6 h-6 text-gold" />
						</div>
						<div>
							<h3 className="font-semibold">Premium Quality</h3>
							<p className="text-sm text-charcoal/60">Crafted with care</p>
						</div>
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="container py-16">
				<div className="text-center mb-12">
					<h2 className="h2 text-4xl md:text-5xl mb-4">Shop by Category</h2>
					<p className="text-charcoal/60 max-w-2xl mx-auto">
						Discover our curated collections designed for every style and occasion
					</p>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{categories.length > 0 ? (
						categories.map((c) => (
							<Link
								key={c.id}
								href={`/products?category=${c.slug}`}
								className="group card text-center"
							>
								<div className="aspect-square rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 ring-1 ring-gold/10 mb-4 overflow-hidden relative">
									<div className="absolute inset-0 bg-gradient-to-t from-charcoal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
								<h3 className="font-semibold text-lg group-hover:text-gold transition-colors">
									{c.name}
								</h3>
								{c.description && (
									<p className="text-sm text-charcoal/60 mt-1 line-clamp-2">{c.description}</p>
								)}
							</Link>
						))
					) : (
						["Men", "Women", "Kids", "Accessories"].map((c) => (
							<Link
								key={c}
								href={`/products?category=${c.toLowerCase()}`}
								className="group card text-center"
							>
								<div className="aspect-square rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 ring-1 ring-gold/10 mb-4" />
								<h3 className="font-semibold text-lg group-hover:text-gold transition-colors">{c}</h3>
							</Link>
						))
					)}
				</div>
			</section>

			{/* Featured Products */}
			<section id="featured" className="container py-16">
				<div className="text-center mb-12">
					<h2 className="h2 text-4xl md:text-5xl mb-4">Featured Products</h2>
					<p className="text-charcoal/60 max-w-2xl mx-auto">
						Handpicked favorites from our latest collection
					</p>
				</div>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{featuredProducts.length > 0 ? (
						featuredProducts.map((product) => (
							<Link
								key={product.id}
								href={`/products/${product.slug}`}
								className="group card overflow-hidden"
							>
								<div className="aspect-[4/5] rounded-xl overflow-hidden ring-1 ring-gold/10 relative mb-4 bg-gray-light">
									{product.images[0] ? (
										<Image
											src={product.images[0].url}
											alt={product.name}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-500"
										/>
									) : (
										<div className="w-full h-full loading-shimmer" />
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
								<div className="space-y-2">
									<p className="text-sm text-charcoal/60 uppercase tracking-wide">
										{product.category.name}
									</p>
									<h3 className="font-semibold text-lg group-hover:text-gold transition-colors line-clamp-1">
										{product.name}
									</h3>
									<p className="text-2xl font-bold text-gold">
										{formatPrice(product.priceCents)}
									</p>
								</div>
							</Link>
						))
					) : (
						Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="card">
								<div className="aspect-[4/5] rounded-xl bg-gray-light loading-shimmer mb-4" />
								<div className="space-y-2">
									<div className="h-4 bg-gray-medium rounded w-3/4 loading-shimmer" />
									<div className="h-6 bg-gray-medium rounded w-1/2 loading-shimmer" />
								</div>
							</div>
						))
					)}
				</div>
				{featuredProducts.length > 0 && (
					<div className="text-center mt-12">
						<Link href="/products" className="btn-secondary inline-flex items-center gap-2 group">
							View All Products
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				)}
			</section>

			{/* Testimonials */}
			<section className="container py-16">
				<div className="text-center mb-12">
					<h2 className="h2 text-4xl md:text-5xl mb-4">What Our Customers Say</h2>
				</div>
				<div className="grid md:grid-cols-3 gap-8">
					{[
						{
							text: "Beautiful quality and fast shipping. The clothes fit perfectly and the material is excellent!",
							author: "Sarah Johnson",
							role: "Verified Customer",
						},
						{
							text: "Love the modern designs and premium feel. My go-to store for quality fashion pieces.",
							author: "Michael Chen",
							role: "Verified Customer",
						},
						{
							text: "Outstanding customer service and the products exceeded my expectations. Highly recommend!",
							author: "Emily Rodriguez",
							role: "Verified Customer",
						},
					].map((testimonial, i) => (
						<div key={i} className="card">
							<div className="flex gap-1 mb-4">
								{Array.from({ length: 5 }).map((_, j) => (
									<Sparkles key={j} className="w-4 h-4 text-gold fill-gold" />
								))}
							</div>
							<p className="text-charcoal/80 italic mb-4 leading-relaxed">"{testimonial.text}"</p>
							<div>
								<p className="font-semibold">{testimonial.author}</p>
								<p className="text-sm text-charcoal/60">{testimonial.role}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Newsletter */}
			<section className="container py-16">
				<div className="card max-w-3xl mx-auto text-center">
					<h2 className="h2 text-3xl md:text-4xl mb-3">Join Our Newsletter</h2>
					<p className="text-charcoal/60 mb-8">
						Get exclusive drops, style tips, and special offers delivered to your inbox
					</p>
					<form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
						<input
							type="email"
							className="input flex-1"
							placeholder="Enter your email"
							required
						/>
						<button type="submit" className="btn-primary whitespace-nowrap">
							Subscribe
						</button>
					</form>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-gold/20 bg-white/50 backdrop-blur-sm py-12 mt-16">
				<div className="container">
					<div className="grid md:grid-cols-4 gap-8 mb-8">
						<div>
							<h3 className="h2 text-xl mb-4">Dinky's Collection</h3>
							<p className="text-sm text-charcoal/60">
								Wear Confidence. Modern, premium fashion for everyone.
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Shop</h4>
							<ul className="space-y-2 text-sm text-charcoal/60">
								<li><Link href="/products?category=men" className="hover:text-gold">Men</Link></li>
								<li><Link href="/products?category=women" className="hover:text-gold">Women</Link></li>
								<li><Link href="/products?category=kids" className="hover:text-gold">Kids</Link></li>
								<li><Link href="/products?category=accessories" className="hover:text-gold">Accessories</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Company</h4>
							<ul className="space-y-2 text-sm text-charcoal/60">
								<li><Link href="/about" className="hover:text-gold">About Us</Link></li>
								<li><Link href="#" className="hover:text-gold">Contact</Link></li>
								<li><Link href="#" className="hover:text-gold">Shipping</Link></li>
								<li><Link href="#" className="hover:text-gold">Returns</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Connect</h4>
							<ul className="space-y-2 text-sm text-charcoal/60">
								<li><Link href="#" className="hover:text-gold">Instagram</Link></li>
								<li><Link href="#" className="hover:text-gold">Facebook</Link></li>
								<li><Link href="#" className="hover:text-gold">Twitter</Link></li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gold/10 pt-8 text-center text-sm text-charcoal/60">
						<p>© {new Date().getFullYear()} Dinky's Collection. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
