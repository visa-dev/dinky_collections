"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderClient from "@/components/HeaderClient";
import { useCart } from "@/contexts/CartContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, CreditCard, Truck, Shield } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const checkoutSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	address: z.string().min(1, "Address is required"),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	zipCode: z.string().min(1, "Zip code is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
	const router = useRouter();
	const { items, getTotal, clearCart } = useCart();
	const [processing, setProcessing] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CheckoutForm>({
		resolver: zodResolver(checkoutSchema),
	});

	const subtotal = getTotal();
	const shipping = subtotal > 10000 ? 0 : 500;
	const total = subtotal + shipping;

	const onSubmit = async (data: CheckoutForm) => {
		if (items.length === 0) {
			alert("Your cart is empty");
			return;
		}
		setProcessing(true);
		try {
			const res = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					items,
					shipping: data,
					total,
				}),
			});
			if (res.ok) {
				clearCart();
				router.push("/checkout/success");
			} else {
				alert("Failed to place order");
			}
		} catch (error) {
			console.error("Checkout error:", error);
			alert("An error occurred");
		} finally {
			setProcessing(false);
		}
	};

	if (items.length === 0) {
		return (
			<div className="min-h-dvh">
				<HeaderClient />
				<div className="container py-12 text-center">
					<p className="text-charcoal/60 text-lg mb-4">Your cart is empty</p>
					<button
						onClick={() => router.push("/products")}
						className="btn-primary"
					>
						Continue Shopping
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-dvh">
			<HeaderClient />
			<div className="container py-8 md:py-12">
				<h1 className="h1 text-4xl md:text-5xl mb-8">Checkout</h1>

				<form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_400px] gap-8">
					{/* Shipping Form */}
					<div className="space-y-6">
						<div className="card">
							<div className="flex items-center gap-3 mb-6">
								<Truck className="w-5 h-5 text-gold" />
								<h2 className="h2 text-2xl">Shipping Information</h2>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gold mb-2">First Name</label>
									<input
										{...register("firstName")}
										className="input"
										placeholder="John"
									/>
									{errors.firstName && (
										<p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gold mb-2">Last Name</label>
									<input
										{...register("lastName")}
										className="input"
										placeholder="Doe"
									/>
									{errors.lastName && (
										<p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
									)}
								</div>
								<div className="col-span-2">
									<label className="block text-sm font-medium text-gold mb-2">Email</label>
									<input
										{...register("email")}
										type="email"
										className="input"
										placeholder="john@example.com"
									/>
									{errors.email && (
										<p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
									)}
								</div>
								<div className="col-span-2">
									<label className="block text-sm font-medium text-gold mb-2">Address</label>
									<input
										{...register("address")}
										className="input"
										placeholder="123 Main Street"
									/>
									{errors.address && (
										<p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gold mb-2">City</label>
									<input
										{...register("city")}
										className="input"
										placeholder="New York"
									/>
									{errors.city && (
										<p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gold mb-2">State</label>
									<input
										{...register("state")}
										className="input"
										placeholder="NY"
									/>
									{errors.state && (
										<p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gold mb-2">Zip Code</label>
									<input
										{...register("zipCode")}
										className="input"
										placeholder="10001"
									/>
									{errors.zipCode && (
										<p className="text-red-600 text-sm mt-1">{errors.zipCode.message}</p>
									)}
								</div>
							</div>
						</div>

						<div className="card">
							<div className="flex items-center gap-3 mb-4">
								<CreditCard className="w-5 h-5 text-gold" />
								<h2 className="h2 text-xl">Payment Method</h2>
							</div>
							<div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
								<p className="text-sm text-charcoal/60">
									<Lock className="w-4 h-4 inline mr-2" />
									Test mode - No payment required
								</p>
							</div>
						</div>
					</div>

					{/* Order Summary */}
					<aside className="card h-fit sticky top-4">
						<h2 className="h2 text-2xl mb-6">Order Summary</h2>
						<div className="space-y-3 mb-6">
							{items.map((item) => (
								<div key={`${item.productId}-${item.size}`} className="flex items-center justify-between text-sm">
									<span className="text-charcoal/80">
										{item.name} ({item.size}) × {item.quantity}
									</span>
									<span className="font-medium text-gold">
										${((item.priceCents * item.quantity) / 100).toFixed(2)}
									</span>
								</div>
							))}
						</div>
						<div className="border-t border-gold/20 pt-4 space-y-2 mb-6">
							<div className="flex items-center justify-between text-charcoal/80">
								<span>Subtotal</span>
								<span className="font-semibold">${(subtotal / 100).toFixed(2)}</span>
							</div>
							<div className="flex items-center justify-between text-charcoal/80">
								<span>Shipping</span>
								<span className="font-semibold">
									{shipping === 0 ? (
										<span className="text-green-600">Free</span>
									) : (
										`$${(shipping / 100).toFixed(2)}`
									)}
								</span>
							</div>
						</div>
						<div className="border-t border-gold/20 pt-4 mb-6">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-lg">Total</span>
								<span className="text-2xl font-bold text-gold">
									${(total / 100).toFixed(2)}
								</span>
							</div>
						</div>
						<button
							type="submit"
							disabled={processing}
							className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{processing ? (
								<>
									<LoadingSpinner size="sm" />
									Processing Order...
								</>
							) : (
								<>
									<Lock className="w-4 h-4" />
									Place Order (Test Mode)
								</>
							)}
						</button>
						<div className="flex items-center gap-2 mt-4 text-xs text-charcoal/60">
							<Shield className="w-4 h-4" />
							<span>Secure checkout powered by test mode</span>
						</div>
					</aside>
				</form>
			</div>
		</div>
	);
}
