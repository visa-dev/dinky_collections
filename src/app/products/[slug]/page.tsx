"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import HeaderClient from "@/components/HeaderClient";
import { Heart, Share2, ArrowLeft } from "lucide-react";
import PageLoader from "@/components/PageLoader";
import { formatPrice } from "@/lib/utils";

interface Product {
	id: string;
	name: string;
	slug: string;
	description: string;
	priceCents: number;
	sizes: string[];
	images: { url: string; index: number }[];
	category: { name: string };
	inStock: boolean;
}

export default function ProductDetailPage() {
	const params = useParams();
	const [product, setProduct] = useState<Product | null>(null);
	const [selectedSize, setSelectedSize] = useState<string>("");
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchProduct() {
			try {
				const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
				const res = await fetch(`/api/products/${slug}`);
				if (res.ok) {
					const data = await res.json();
					setProduct(data);
					if (data.sizes.length > 0) {
						setSelectedSize(data.sizes[0]);
					}
				}
			} catch (error) {
				console.error("Failed to fetch product:", error);
			} finally {
				setLoading(false);
			}
		}
		if (params.slug) {
			fetchProduct();
		}
	}, [params.slug]);


	if (loading) {
		return (
			<PageLoader message="Loading product details..." />
		);
	}

	if (!product) {
		return (
			<div className="min-h-dvh">
				<HeaderClient />
				<div className="container py-12 text-center">
					<p className="text-charcoal/60 text-lg mb-4">Product not found</p>
					<Link href="/products" className="btn-secondary inline-flex items-center gap-2">
						<ArrowLeft className="w-4 h-4" />
						Back to Products
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-dvh">
			<HeaderClient />
			<div className="container py-8 md:py-12">
				<nav className="text-sm mb-8 flex items-center gap-2">
					<Link href="/products" className="text-charcoal/60 hover:text-gold transition-colors">
						Products
					</Link>
					<span className="text-charcoal/40">/</span>
					<span className="text-gold">{product.name}</span>
				</nav>

				<div className="grid lg:grid-cols-2 gap-12">
					{/* Image Gallery */}
					<div className="space-y-4">
						<div className="aspect-[4/5] rounded-2xl overflow-hidden ring-2 ring-gold/10 relative bg-gray-light">
							{product.images[selectedImageIndex] ? (
								<Image
									src={product.images[selectedImageIndex].url}
									alt={product.name}
									fill
									className="object-cover"
									priority
								/>
							) : (
								<div className="w-full h-full loading-shimmer" />
							)}
						</div>
						{product.images.length > 1 && (
							<div className="grid grid-cols-4 gap-3">
								{product.images.map((img, i) => (
									<button
										key={i}
										onClick={() => setSelectedImageIndex(i)}
										className={`aspect-square rounded-xl overflow-hidden ring-2 transition-all ${
											selectedImageIndex === i
												? "ring-gold scale-105"
												: "ring-gold/10 hover:ring-gold/30"
										} relative bg-gray-light`}
									>
										<Image
											src={img.url}
											alt={`${product.name} ${i + 1}`}
											fill
											className="object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Product Info */}
					<div className="space-y-6">
						<div>
							<p className="text-sm text-gold uppercase tracking-wide mb-2">{product.category.name}</p>
							<h1 className="h1 text-4xl md:text-5xl mb-4">{product.name}</h1>
							<div className="flex items-baseline gap-3 mb-6">
								<span className="text-4xl font-bold text-gold">
									{formatPrice(product.priceCents)}
								</span>
								{product.inStock ? (
									<span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
										In Stock
									</span>
								) : (
									<span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-medium">
										Out of Stock
									</span>
								)}
							</div>
						</div>

						<div className="prose prose-sm max-w-none">
							<p className="text-charcoal/80 leading-relaxed">{product.description}</p>
						</div>

						{/* Size Selection */}
						<div>
							<label className="block text-sm font-medium text-gold mb-3">Select Size</label>
							<div className="flex flex-wrap gap-3">
								{product.sizes.map((s) => (
									<button
										key={s}
										onClick={() => setSelectedSize(s)}
										disabled={!product.inStock}
										className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
											selectedSize === s
												? "border-gold bg-gold/10 text-gold scale-105"
												: "border-gold/20 hover:border-gold/40 text-charcoal"
										} ${!product.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
									>
										{s}
									</button>
								))}
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-4 pt-4">
							<button className="p-3 rounded-xl border-2 border-gold/20 hover:border-gold/40 hover:bg-gold/5 transition-all" title="Add to favorites">
								<Heart className="w-5 h-5" />
							</button>
							<button 
								onClick={() => {
									if (navigator.share) {
										navigator.share({
											title: product.name,
											text: product.description,
											url: window.location.href,
										});
									}
								}}
								className="p-3 rounded-xl border-2 border-gold/20 hover:border-gold/40 hover:bg-gold/5 transition-all" 
								title="Share product"
							>
								<Share2 className="w-5 h-5" />
							</button>
						</div>

						{/* Additional Info */}
						<div className="pt-6 border-t border-gold/10 space-y-4 text-sm">
							<div className="flex items-start gap-3">
								<span className="font-medium text-charcoal/80 min-w-[100px]">Category:</span>
								<span className="text-charcoal/60">{product.category.name}</span>
							</div>
							<div className="flex items-start gap-3">
								<span className="font-medium text-charcoal/80 min-w-[100px]">Availability:</span>
								<span className="text-charcoal/60">{product.inStock ? "In Stock" : "Out of Stock"}</span>
							</div>
							<div className="flex items-start gap-3">
								<span className="font-medium text-charcoal/80 min-w-[100px]">Care:</span>
								<span className="text-charcoal/60">Machine washable, follow care instructions</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
