"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import HeaderClient from "@/components/HeaderClient";
import { Sliders, Filter, Grid, List } from "lucide-react";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageLoader from "@/components/PageLoader";
import { formatPrice } from "@/lib/utils";

interface Product {
	id: string;
	name: string;
	slug: string;
	priceCents: number;
	images: { url: string }[];
	category: { name: string; slug: string };
}

function ProductsContent() {
	const searchParams = useSearchParams();
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
	const [loading, setLoading] = useState(true);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [filters, setFilters] = useState({
		category: searchParams.get("category") || "",
		size: "",
		maxPrice: "",
		sort: "newest",
		search: "",
	});

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			try {
				const [productsRes, categoriesRes] = await Promise.all([
					fetch(
						`/api/products?${new URLSearchParams({
							...(filters.category && { category: filters.category }),
							...(filters.size && { size: filters.size }),
							...(filters.maxPrice && { maxPrice: filters.maxPrice }),
							...(filters.sort && { sort: filters.sort }),
							...(filters.search && { search: filters.search }),
						}).toString()}`
					),
					fetch("/api/categories"),
				]);
				const productsData = await productsRes.json();
				const categoriesData = await categoriesRes.json();
				setProducts(productsData);
				setCategories(categoriesData);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [filters]);

	return (
		<div className="min-h-dvh">
			<HeaderClient />
			<div className="container py-8 md:py-12">
				<div className="mb-8">
					<h1 className="h1 text-4xl md:text-5xl mb-2">Shop</h1>
					<p className="text-charcoal/60">Discover our complete collection</p>
				</div>

				<div className="grid lg:grid-cols-[280px_1fr] gap-8">
					{/* Search and Filters Sidebar */}
					<aside className="card h-fit sticky top-4">
						<div className="flex items-center gap-2 mb-6">
							<Filter className="w-5 h-5 text-gold" />
							<h2 className="font-semibold text-lg">Search & Filter</h2>
						</div>
						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gold mb-2">Search Products</label>
								<input
									type="text"
									className="input"
									placeholder="Search by name..."
									value={filters.search || ""}
									onChange={(e) => setFilters({ ...filters, search: e.target.value })}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gold mb-2">Category</label>
								<select
									className="input"
									value={filters.category}
									onChange={(e) => setFilters({ ...filters, category: e.target.value })}
								>
									<option value="">All Categories</option>
									{categories.map((c) => (
										<option key={c.id} value={c.slug}>
											{c.name}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gold mb-2">Size</label>
								<select
									className="input"
									value={filters.size}
									onChange={(e) => setFilters({ ...filters, size: e.target.value })}
								>
									<option value="">All Sizes</option>
									{["XS", "S", "M", "L", "XL"].map((s) => (
										<option key={s} value={s}>
											{s}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gold mb-2">Max Price (LKR)</label>
								<input
									type="number"
									className="input"
									placeholder="0.00"
									value={filters.maxPrice}
									onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
								/>
							</div>
							<button
								onClick={() => setFilters({ category: "", size: "", maxPrice: "", sort: "newest", search: "" })}
								className="w-full text-sm text-charcoal/60 hover:text-gold underline"
							>
								Clear All
							</button>
						</div>
					</aside>

					{/* Products Grid */}
					<main>
						<div className="flex items-center justify-between mb-6">
							<div className="text-sm text-charcoal/60">
								{loading ? (
									"Loading..."
								) : (
									<>
										<span className="font-semibold text-charcoal">{products.length}</span> products found
									</>
								)}
							</div>
							<div className="flex items-center gap-4">
								<select
									className="input text-sm py-2"
									value={filters.sort}
									onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
								>
									<option value="newest">Newest First</option>
									<option value="price-asc">Price: Low to High</option>
									<option value="price-desc">Price: High to Low</option>
								</select>
								<div className="flex gap-2 border border-gold/20 rounded-lg p-1">
									<button
										onClick={() => setViewMode("grid")}
										className={`p-2 rounded ${viewMode === "grid" ? "bg-gold/10 text-gold" : "text-charcoal/60"}`}
									>
										<Grid className="w-4 h-4" />
									</button>
									<button
										onClick={() => setViewMode("list")}
										className={`p-2 rounded ${viewMode === "list" ? "bg-gold/10 text-gold" : "text-charcoal/60"}`}
									>
										<List className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>

					{loading ? (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							<ProductCardSkeleton count={6} />
						</div>
					) : products.length === 0 ? (
							<div className="card text-center py-16">
								<p className="text-charcoal/60 text-lg mb-4">No products found</p>
								<p className="text-sm text-charcoal/50 mb-6">Try adjusting your filters</p>
								<button
									onClick={() => setFilters({ category: "", size: "", maxPrice: "", sort: "newest", search: "" })}
									className="btn-secondary"
								>
									Clear All Filters
								</button>
							</div>
						) : viewMode === "grid" ? (
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{products.map((product) => (
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
										</div>
										<div className="space-y-2">
											<p className="text-xs text-charcoal/60 uppercase tracking-wide">
												{product.category.name}
											</p>
											<h3 className="font-semibold group-hover:text-gold transition-colors line-clamp-2">
												{product.name}
											</h3>
											<p className="text-xl font-bold text-gold">
												{formatPrice(product.priceCents)}
											</p>
										</div>
									</Link>
								))}
							</div>
						) : (
							<div className="space-y-4">
								{products.map((product) => (
									<Link
										key={product.id}
										href={`/products/${product.slug}`}
										className="group card flex gap-6 hover:ring-gold/30"
									>
										<div className="w-32 h-32 rounded-xl overflow-hidden ring-1 ring-gold/10 relative flex-shrink-0 bg-gray-light">
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
										</div>
										<div className="flex-1 flex flex-col justify-between">
											<div>
												<p className="text-xs text-charcoal/60 uppercase tracking-wide mb-1">
													{product.category.name}
												</p>
												<h3 className="font-semibold text-lg group-hover:text-gold transition-colors mb-2">
													{product.name}
												</h3>
											</div>
											<p className="text-2xl font-bold text-gold">
												{formatPrice(product.priceCents)}
											</p>
										</div>
									</Link>
								))}
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}

export default function ProductsPage() {
	return (
		<Suspense fallback={
			<div className="min-h-dvh">
				<HeaderClient />
				<div className="container py-8 md:py-12">
					<div className="mb-8">
						<h1 className="h1 text-4xl md:text-5xl mb-2">Shop</h1>
						<p className="text-charcoal/60">Loading...</p>
					</div>
				</div>
			</div>
		}>
			<ProductsContent />
		</Suspense>
	);
}
