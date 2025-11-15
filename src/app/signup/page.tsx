"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import HeaderClient from "@/components/HeaderClient";
import LoadingSpinner from "@/components/LoadingSpinner";

const signupSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupForm>({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (data: SignupForm) => {
		setLoading(true);
		setError(null);

		try {
			// Create account
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: data.email,
					password: data.password,
					name: data.name,
				}),
			});

			const result = await res.json();

			if (!res.ok) {
				setError(result.error || "Failed to create account");
				setLoading(false);
				return;
			}

			// Auto-login after signup
			const signInResult = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (signInResult?.error) {
				setError("Account created but login failed. Please try logging in.");
				setLoading(false);
				return;
			}

			// Redirect to home or products page
			router.push("/products");
			router.refresh();
		} catch (error) {
			console.error("Signup error:", error);
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
						<h1 className="h1 text-3xl mb-2">Create Account</h1>
						<p className="text-sm text-gold/70 mb-6">
							Join Dinky's Collection to start shopping
						</p>

						{error && (
							<div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div>
								<label className="block text-sm text-gold mb-1">Full Name</label>
								<input
									{...register("name")}
									type="text"
									className="w-full rounded-lg border border-gold/30 bg-white p-3"
									placeholder="John Doe"
								/>
								{errors.name && (
									<p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm text-gold mb-1">Email</label>
								<input
									{...register("email")}
									type="email"
									className="w-full rounded-lg border border-gold/30 bg-white p-3"
									placeholder="you@example.com"
								/>
								{errors.email && (
									<p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm text-gold mb-1">Password</label>
								<input
									{...register("password")}
									type="password"
									className="w-full rounded-lg border border-gold/30 bg-white p-3"
									placeholder="••••••••"
								/>
								{errors.password && (
									<p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm text-gold mb-1">Confirm Password</label>
								<input
									{...register("confirmPassword")}
									type="password"
									className="w-full rounded-lg border border-gold/30 bg-white p-3"
									placeholder="••••••••"
								/>
								{errors.confirmPassword && (
									<p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
								)}
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? (
									<>
										<LoadingSpinner size="sm" />
										Creating Account...
									</>
								) : (
									"Create Account"
								)}
							</button>
						</form>

						<div className="mt-6 text-center text-sm">
							<span className="text-gold/70">Already have an account? </span>
							<Link href="/api/auth/signin" className="text-gold hover:underline">
								Sign In
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

