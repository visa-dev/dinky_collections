"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload } from "lucide-react";
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

export default function EditProductPage() {
	const router = useRouter();
	const params = useParams();
	const [categories, setCategories] = useState<Category[]>([]);
	const [images, setImages] = useState<{ url: string; blobId?: string; index: number }[]>([]);
	const [uploading, setUploading] = useState(false);
	const [loading, setLoading] = useState(true);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<ProductForm>({
		resolver: zodResolver(productFormSchema),
	});

	const selectedSizes = watch("sizes");

	useEffect(() => {
			async function fetchData() {
			try {
				const [categoriesRes, productRes] = await Promise.all([
					fetch("/api/categories"),
					fetch(`/api/products/id/${params.id}`),
				]);
				const categoriesData = await categoriesRes.json();
				const productData = await productRes.json();
				setCategories(categoriesData);
				setValue("name", productData.name);
				setValue("slug", productData.slug);
				setValue("description", productData.description);
				setValue("priceCents", formatPriceNumber(productData.priceCents));
				setValue("sizes", productData.sizes);
				setValue("categoryId", productData.categoryId);
				setValue("inStock", productData.inStock);
				setImages(productData.images || []);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			} finally {
				setLoading(false);
			}
		}
		if (params.id) {
			fetchData();
		}
	}, [params.id, setValue]);

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
			const res = await fetch(`/api/products/id/${params.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...data, images }),
			});
			if (res.ok) {
				router.push("/admin/products");
			} else {
				const error = await res.json();
				alert(error.error || "Failed to update product");
			}
		} catch (error) {
			console.error("Failed to update product:", error);
			alert("An error occurred");
		}
	}

	if (loading) {
		return (
			<div className="container py-10">
				<div className="text-center py-12">Loading...</div>
			</div>
		);
	}

	return (
		<div className="container py-10">
			<h1 className="h1 text-3xl mb-6">Edit Product</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm text-gold mb-1">Name</label>
						<input
							{...register("name")}
							className="w-full rounded-lg border border-gold/30 bg-white p-3"
							placeholder="Product name"
						/>
						{errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
					</div>
					<div>
						<label className="block text-sm text-gold mb-1">Slug</label>
						<input
							{...register("slug")}
							className="w-full rounded-lg border border-gold/30 bg-white p-3"
							placeholder="product-slug"
						/>
						{errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>}
					</div>
					<div className="md:col-span-2">
						<label className="block text-sm text-gold mb-1">Description</label>
						<textarea
							{...register("description")}
							rows={4}
							className="w-full rounded-lg border border-gold/30 bg-white p-3"
							placeholder="Product description"
						/>
						{errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
					</div>
					<div>
						<label className="block text-sm text-gold mb-1">Price (LKR)</label>
						<input
							type="number"
							step="0.01"
							{...register("priceCents", { valueAsNumber: true, setValueAs: (v) => priceToCents(parseFloat(v)) })}
							className="w-full rounded-lg border border-gold/30 bg-white p-3"
							placeholder="0.00"
						/>
						<p className="text-xs text-charcoal/50 mt-1">Enter price in Sri Lankan Rupees</p>
						{errors.priceCents && <p className="text-red-600 text-sm mt-1">{errors.priceCents.message}</p>}
					</div>
					<div>
						<label className="block text-sm text-gold mb-1">Category</label>
						<select {...register("categoryId")} className="w-full rounded-lg border border-gold/30 bg-white p-3">
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
						<label className="block text-sm text-gold mb-1">Sizes</label>
						<div className="flex gap-2 flex-wrap">
							{["XS", "S", "M", "L", "XL"].map((size) => (
								<button
									key={size}
									type="button"
									onClick={() => toggleSize(size)}
									className={`rounded-full border px-4 py-2 ${
										selectedSizes?.includes(size)
											? "border-gold bg-gold/10 text-gold"
											: "border-gold/30 hover:bg-gold/5"
									}`}
								>
									{size}
								</button>
							))}
						</div>
						{errors.sizes && <p className="text-red-600 text-sm mt-1">{errors.sizes.message}</p>}
					</div>
					<div>
						<label className="flex items-center gap-2">
							<input type="checkbox" {...register("inStock")} className="rounded" />
							<span className="text-sm text-gold">In Stock</span>
						</label>
					</div>
				</div>
				<div>
					<label className="block text-sm text-gold mb-1">Images</label>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{images.map((img, i) => (
							<div key={i} className="relative aspect-square rounded-lg overflow-hidden ring-1 ring-gold/10">
								<img src={img.url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
								<button
									type="button"
									onClick={() => removeImage(i)}
									className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						))}
						{images.length < 8 && (
							<label className="aspect-square rounded-lg border-2 border-dashed border-gold/30 flex items-center justify-center cursor-pointer hover:border-gold/50">
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
									<div className="text-gold">Uploading...</div>
								) : (
									<Upload className="w-6 h-6 text-gold" />
								)}
							</label>
						)}
					</div>
					{images.length === 0 && <p className="text-red-600 text-sm mt-1">At least one image is required</p>}
				</div>
				<div className="flex gap-3">
					<button type="submit" className="rounded-full bg-charcoal px-6 py-3 text-white hover:opacity-90">
						Update Product
					</button>
					<button
						type="button"
						onClick={() => router.back()}
						className="rounded-full border border-gold px-6 py-3 hover:bg-gold/10"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

