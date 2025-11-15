"use client";

import { useEffect, useState } from "react";
import { Plus, Tag, X } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminCategoriesPage() {
	const [categories, setCategories] = useState<any[]>([]);
	const [form, setForm] = useState({ name: "", slug: "", description: "" });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetch("/api/categories")
			.then((r) => r.json())
			.then(setCategories)
			.catch(() => {});
	}, []);

	async function onCreate(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await fetch("/api/categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			if (res.ok) {
				const c = await res.json();
				setCategories((prev) => [c, ...prev]);
				setForm({ name: "", slug: "", description: "" });
			} else {
				const error = await res.json();
				alert(error.error || "Failed to create category");
			}
		} catch (error) {
			console.error("Failed to create category:", error);
			alert("An error occurred");
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this category?")) return;
		// Note: You may want to add a DELETE endpoint for categories
		alert("Delete functionality can be added if needed");
	}

	return (
		<div className="container py-10">
			<div className="mb-8">
				<h1 className="h1 text-3xl md:text-4xl mb-2">Categories</h1>
				<p className="text-charcoal/60">Manage product categories</p>
			</div>

			<form
				onSubmit={onCreate}
				className="card grid sm:grid-cols-3 gap-4 mb-8"
			>
				<input
					className="input"
					placeholder="Category Name"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					required
				/>
				<input
					className="input"
					placeholder="Slug (e.g., men)"
					value={form.slug}
					onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
					required
				/>
				<input
					className="input sm:col-span-3"
					placeholder="Description (optional)"
					value={form.description}
					onChange={(e) => setForm({ ...form, description: e.target.value })}
				/>
				<button
					type="submit"
					disabled={loading}
					className="btn-primary sm:col-span-3 flex items-center justify-center gap-2 disabled:opacity-50"
				>
					{loading ? (
						<>
							<LoadingSpinner size="sm" />
							Creating...
						</>
					) : (
						<>
							<Plus className="w-5 h-5" />
							Create Category
						</>
					)}
				</button>
			</form>

			{categories.length === 0 ? (
				<div className="card text-center py-16">
					<Tag className="w-16 h-16 text-gold/40 mx-auto mb-4" />
					<p className="text-charcoal/60 text-lg mb-4">No categories yet</p>
					<p className="text-sm text-charcoal/50">Create your first category above</p>
				</div>
			) : (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{categories.map((c) => (
						<div key={c.id} className="card group">
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
										<Tag className="w-6 h-6 text-gold" />
									</div>
									<div>
										<h3 className="font-semibold text-lg">{c.name}</h3>
										<p className="text-sm text-charcoal/60">/{c.slug}</p>
									</div>
								</div>
								<button
									onClick={() => handleDelete(c.id)}
									className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
							{c.description && (
								<p className="text-sm text-charcoal/70 line-clamp-2">{c.description}</p>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
