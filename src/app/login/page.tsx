"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import HeaderClient from "@/components/HeaderClient";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const result = await signIn("credentials", {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});

			if (result?.error) {
				setError("Invalid email or password");
				setLoading(false);
				return;
			}

			// Redirect to products page
			router.push("/products");
			router.refresh();
		} catch (error) {
			console.error("Login error:", error);
			setError("An unexpected error occurred");
			setLoading(false);
		}
	};

	return (
		<div className="min-h-dvh">
			<HeaderClient />
			<div className="container py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="w-full max-w-md">
					<div className="rounded-xl bg-white/70 p-8 ring-1 ring-gold/20">
						<h1 className="h1 text-3xl mb-2">Sign In</h1>
						<p className="text-sm text-gold/70 mb-6">
							Welcome back to Dinky's Collection
						</p>

						{error && (
							<div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
								{error}
							</div>
						)}

						<form onSubmit={onSubmit} className="space-y-4">
							<div>
								<label className="block text-sm text-gold mb-1">Email</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className="w-full rounded-lg border border-gold/30 bg-white p-3"
									placeholder="you@example.com"
									required
								/>
							</div>

							<div>
								<label className="block text-sm text-gold mb-1">Password</label>
								<input
									type="password"
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									className="w-full rounded-lg border border-gold/30 bg-white p-3"
									placeholder="••••••••"
									required
								/>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? (
									<>
										<LoadingSpinner size="sm" />
										Signing In...
									</>
								) : (
									"Sign In"
								)}
							</button>
						</form>

						<div className="mt-6 text-center text-sm">
							<span className="text-gold/70">Don't have an account? </span>
							<Link href="/signup" className="text-gold hover:underline">
								Sign Up
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

