"use client";

import Link from "next/link";
import HeaderClient from "@/components/HeaderClient";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
	return (
		<div className="min-h-dvh">
			<HeaderClient />
			<div className="container py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="card max-w-md text-center">
					<div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="w-12 h-12 text-green-600" />
					</div>
					<h1 className="h1 text-3xl mb-4">Order Placed Successfully!</h1>
					<p className="text-charcoal/60 mb-8">
						Thank you for your order. You will receive a confirmation email shortly.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<Link href="/products" className="btn-primary flex items-center justify-center gap-2">
							<ShoppingBag className="w-4 h-4" />
							Continue Shopping
						</Link>
						<Link href="/" className="btn-secondary flex items-center justify-center gap-2">
							Back to Home
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

