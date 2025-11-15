"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus, Package } from "lucide-react";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatPrice } from "@/lib/utils";

interface Product {
	id: string;
	name: string;
	slug: string;
	priceCents: number;
	images: { url: string }[];
	inStock: boolean;
}

export default function AdminProductsPage() {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchProducts();
	}, []);

	async function fetchProducts() {
		setLoading(true);
		try {
			const res = await fetch("/api/products");
			const data = await res.json();
			setProducts(data);
		} catch (error) {
			console.error("Failed to fetch products:", error);
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this product?")) return;
		try {
			const res = await fetch(`/api/products/id/${id}`, { method: "DELETE" });
			if (res.ok) {
				setProducts(products.filter((p) => p.id !== id));
			} else {
				alert("Failed to delete product");
			}
		} catch (error) {
			console.error("Failed to delete product:", error);
			alert("An error occurred");
		}
	}

	return (
		<div className="container py-10">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="h1 text-3xl md:text-4xl mb-2">Products</h1>
					<p className="text-charcoal/60">Manage your product catalog</p>
				</div>
				<Link
					href="/admin/products/new"
					className="btn-primary flex items-center gap-2"
				>
					<Plus className="w-5 h-5" />
					Add Product
				</Link>
			</div>

			{loading ? (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					<ProductCardSkeleton count={6} />
				</div>
			) : products.length === 0 ? (
				<div className="card text-center py-16">
					<Package className="w-16 h-16 text-gold/40 mx-auto mb-4" />
					<p className="text-charcoal/60 text-lg mb-4">No products yet</p>
					<Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
						<Plus className="w-5 h-5" />
						Create Your First Product
					</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((p) => (
						<div key={p.id} className="card group">
							<div className="aspect-[4/5] rounded-xl overflow-hidden ring-1 ring-gold/10 relative mb-4 bg-gray-light">
								{p.images[0] ? (
									<Image
										src={p.images[0].url}
										alt={p.name}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-gold/5">
										<Package className="w-12 h-12 text-gold/30" />
									</div>
								)}
								{!p.inStock && (
									<div className="absolute top-2 right-2 px-2 py-1 rounded bg-red-500 text-white text-xs font-medium">
										Out of Stock
									</div>
								)}
							</div>
							<div className="space-y-2 mb-4">
								<h3 className="font-semibold text-lg line-clamp-1">{p.name}</h3>
								<p className="text-2xl font-bold text-gold">{formatPrice(p.priceCents)}</p>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => router.push(`/admin/products/${p.id}/edit`)}
									className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm py-2.5"
								>
									<Edit className="w-4 h-4" />
									Edit
								</button>
								<button
									onClick={() => handleDelete(p.id)}
									className="px-4 py-2.5 rounded-xl border-2 border-red-300 text-red-600 hover:bg-red-50 transition-colors"
									aria-label="Delete"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
