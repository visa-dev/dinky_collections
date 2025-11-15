"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import { priceToCents, formatPriceNumber } from "@/lib/utils";

const productFormSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	slug: z.string().min(2, "Slug must be at least 2 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	priceCents: z.number().min(0, "Price must be positive"),
	sizes: z.array(z.string()).min(1, "At least one size is required"),
	categoryId: z.string().min(1, "Category is required"),
	inStock: z.boolean().default(true),
});

type ProductForm = z.infer<typeof productFormSchema>;

interface Category {
	id: string;
	name: string;
	slug: string;
}

export default function NewProductPage() {
	const router = useRouter();
	const [categories, setCategories] = useState<Category[]>([]);
	const [images, setImages] = useState<{ url: string; blobId?: string; index: number }[]>([]);
	const [uploading, setUploading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<ProductForm>({
		resolver: zodResolver(productFormSchema),
		defaultValues: {
			sizes: [],
			inStock: true,
		},
	});

	const selectedSizes = watch("sizes");
	const name = watch("name");

	useEffect(() => {
		fetch("/api/categories")
			.then((r) => r.json())
			.then(setCategories)
			.catch(() => {});
	}, []);

	useEffect(() => {
		if (name) {
			const slug = name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");
			setValue("slug", slug);
		}
	}, [name, setValue]);

	async function handleImageUpload(file: File) {
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const uploadRes = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});
			if (!uploadRes.ok) {
				throw new Error("Upload failed");
			}
			const data = await uploadRes.json();
			setImages([...images, { url: data.url, blobId: data.blobId, index: images.length }]);
		} catch (error) {
			console.error("Upload error:", error);
			alert("Failed to upload image");
		} finally {
			setUploading(false);
		}
	}

	function removeImage(index: number) {
		setImages(images.filter((_, i) => i !== index).map((img, i) => ({ ...img, index: i })));
	}

	function toggleSize(size: string) {
		const current = selectedSizes || [];
		if (current.includes(size)) {
			setValue("sizes", current.filter((s) => s !== size));
		} else {
			setValue("sizes", [...current, size]);
		}
	}

	async function onSubmit(data: ProductForm) {
		if (images.length === 0) {
			alert("Please upload at least one image");
			return;
		}
		try {
			const res = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...data, images }),
			});
			if (res.ok) {
				router.push("/admin/products");
			} else {
				const error = await res.json();
				alert(error.error || "Failed to create product");
			}
		} catch (error) {
			console.error("Failed to create product:", error);
			alert("An error occurred");
		}
	}

	return (
		<div className="container py-10">
			<div className="mb-8">
				<Link
					href="/admin/products"
					className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-gold mb-4 transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Products
				</Link>
				<h1 className="h1 text-3xl md:text-4xl mb-2">New Product</h1>
				<p className="text-charcoal/60">Add a new product to your catalog</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gold mb-2">Product Name *</label>
						<input
							{...register("name")}
							className="input"
							placeholder="e.g., Classic White T-Shirt"
						/>
						{errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
					</div>
					<div>
						<label className="block text-sm font-medium text-gold mb-2">Slug *</label>
						<input
							{...register("slug")}
							className="input"
							placeholder="e.g., classic-white-tshirt"
						/>
						<p className="text-xs text-charcoal/50 mt-1">Auto-generated from name</p>
						{errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>}
					</div>
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gold mb-2">Description *</label>
						<textarea
							{...register("description")}
							rows={4}
							className="input resize-none"
							placeholder="Describe your product in detail..."
						/>
						{errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
					</div>
					<div>
						<label className="block text-sm font-medium text-gold mb-2">Price (LKR) *</label>
						<input
							type="number"
							step="0.01"
							{...register("priceCents", {
								valueAsNumber: true,
								setValueAs: (v) => priceToCents(parseFloat(v)),
							})}
							className="input"
							placeholder="2999.00"
						/>
						<p className="text-xs text-charcoal/50 mt-1">Enter price in Sri Lankan Rupees</p>
						{errors.priceCents && <p className="text-red-600 text-sm mt-1">{errors.priceCents.message}</p>}
					</div>
					<div>
						<label className="block text-sm font-medium text-gold mb-2">Category *</label>
						<select {...register("categoryId")} className="input">
							<option value="">Select category</option>
							{categories.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
						{errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>}
					</div>
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gold mb-2">Available Sizes *</label>
						<div className="flex gap-3 flex-wrap">
							{["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
								<button
									key={size}
									type="button"
									onClick={() => toggleSize(size)}
									className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
										selectedSizes?.includes(size)
											? "border-gold bg-gold/10 text-gold scale-105"
											: "border-gold/20 hover:border-gold/40 text-charcoal"
									}`}
								>
									{size}
								</button>
							))}
						</div>
						{errors.sizes && <p className="text-red-600 text-sm mt-1">{errors.sizes.message}</p>}
					</div>
					<div className="md:col-span-2">
						<label className="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								{...register("inStock")}
								className="w-5 h-5 rounded border-gold/30 text-gold focus:ring-gold/20"
							/>
							<span className="text-sm font-medium text-charcoal">In Stock</span>
						</label>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gold mb-3">Product Images *</label>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{images.map((img, i) => (
							<div
								key={i}
								className="relative aspect-square rounded-xl overflow-hidden ring-2 ring-gold/10 group"
							>
								<img src={img.url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
								<button
									type="button"
									onClick={() => removeImage(i)}
									className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
									aria-label="Remove image"
								>
									<X className="w-4 h-4" />
								</button>
								<div className="absolute bottom-2 left-2 bg-charcoal/80 text-white text-xs px-2 py-1 rounded">
									#{i + 1}
								</div>
							</div>
						))}
						{images.length < 8 && (
							<label className="aspect-square rounded-xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all group">
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) handleImageUpload(file);
									}}
									disabled={uploading}
								/>
								{uploading ? (
									<div className="text-gold font-medium">Uploading...</div>
								) : (
									<>
										<Upload className="w-8 h-8 text-gold mb-2 group-hover:scale-110 transition-transform" />
										<span className="text-sm text-charcoal/60">Add Image</span>
									</>
								)}
							</label>
						)}
					</div>
					{images.length === 0 && (
						<p className="text-red-600 text-sm mt-2">At least one image is required</p>
					)}
					<p className="text-xs text-charcoal/50 mt-2">Upload up to 8 images. First image will be the main product image.</p>
				</div>

				<div className="flex gap-4 pt-4 border-t border-gold/10">
					<button
						type="submit"
						disabled={isSubmitting || uploading}
						className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting || uploading ? (
							<>
								<LoadingSpinner size="sm" />
								{uploading ? "Uploading..." : "Creating..."}
							</>
						) : (
							<>
								<Save className="w-5 h-5" />
								Create Product
							</>
						)}
					</button>
					<button
						type="button"
						onClick={() => router.back()}
						className="btn-secondary"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
