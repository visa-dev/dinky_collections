import Link from "next/link";
import { Package, Tag, BarChart3, Users } from "lucide-react";

import { prisma } from "@/lib/prisma";

async function getStats() {
	try {
		const [products, categories] = await Promise.all([
			prisma.product.count(),
			prisma.category.count(),
		]);
		return {
			productCount: products,
			categoryCount: categories,
		};
	} catch {
		return { productCount: 0, categoryCount: 0 };
	}
}

export default async function AdminDashboardPage() {
	const stats = await getStats();

	return (
		<div className="container py-10">
			<div className="mb-8">
				<h1 className="h1 text-3xl md:text-4xl mb-2">Admin Dashboard</h1>
				<p className="text-charcoal/60">Manage your store and products</p>
			</div>

			{/* Stats */}
			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="card">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
							<Package className="w-6 h-6 text-gold" />
						</div>
						<div>
							<p className="text-2xl font-bold text-charcoal">{stats.productCount}</p>
							<p className="text-sm text-charcoal/60">Products</p>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
							<Tag className="w-6 h-6 text-gold" />
						</div>
						<div>
							<p className="text-2xl font-bold text-charcoal">{stats.categoryCount}</p>
							<p className="text-sm text-charcoal/60">Categories</p>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
							<BarChart3 className="w-6 h-6 text-gold" />
						</div>
						<div>
							<p className="text-2xl font-bold text-charcoal">-</p>
							<p className="text-sm text-charcoal/60">Orders</p>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
							<Users className="w-6 h-6 text-gold" />
						</div>
						<div>
							<p className="text-2xl font-bold text-charcoal">-</p>
							<p className="text-sm text-charcoal/60">Customers</p>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-2 gap-6">
				<Link href="/admin/products" className="card group hover:ring-gold/30 transition-all">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
							<Package className="w-8 h-8 text-gold" />
						</div>
						<div className="flex-1">
							<h3 className="h2 text-xl mb-1">Products</h3>
							<p className="text-sm text-charcoal/60">Manage your product catalog</p>
						</div>
					</div>
				</Link>
				<Link href="/admin/categories" className="card group hover:ring-gold/30 transition-all">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
							<Tag className="w-8 h-8 text-gold" />
						</div>
						<div className="flex-1">
							<h3 className="h2 text-xl mb-1">Categories</h3>
							<p className="text-sm text-charcoal/60">Organize your products</p>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}
