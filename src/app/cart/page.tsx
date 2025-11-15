"use client";

import Link from "next/link";
import Image from "next/image";
import HeaderClient from "@/components/HeaderClient";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
	const { items, removeItem, updateQuantity, getTotal } = useCart();

	const subtotal = getTotal();
	const shipping = subtotal > 10000 ? 0 : 500; // Free shipping over $100
	const total = subtotal + shipping;

	return (
		<div className="min-h-dvh">
			<HeaderClient />
			<div className="container py-8 md:py-12">
				<h1 className="h1 text-4xl md:text-5xl mb-8">Shopping Cart</h1>

				{items.length === 0 ? (
					<div className="card text-center py-16 max-w-md mx-auto">
						<ShoppingBag className="w-16 h-16 text-gold/40 mx-auto mb-4" />
						<h2 className="h2 text-2xl mb-2">Your cart is empty</h2>
						<p className="text-charcoal/60 mb-6">Start adding items to your cart</p>
						<Link href="/products" className="btn-primary inline-flex items-center gap-2">
							Continue Shopping
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				) : (
					<div className="grid lg:grid-cols-[1fr_400px] gap-8">
						{/* Cart Items */}
						<div className="space-y-4">
							{items.map((item, index) => (
								<div
									key={`${item.productId}-${item.size}-${index}`}
									className="card flex gap-6 group"
								>
									<Link
										href={`/products/${item.slug}`}
										className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden ring-1 ring-gold/10 relative flex-shrink-0 bg-gray-light"
									>
										{item.imageUrl ? (
											<Image
												src={item.imageUrl}
												alt={item.name}
												fill
												className="object-cover"
											/>
										) : (
											<div className="w-full h-full loading-shimmer" />
										)}
									</Link>
									<div className="flex-1 flex flex-col justify-between min-w-0">
										<div>
											<Link
												href={`/products/${item.slug}`}
												className="font-semibold text-lg hover:text-gold transition-colors block mb-1"
											>
												{item.name}
											</Link>
											<p className="text-sm text-charcoal/60">Size: {item.size}</p>
										</div>
										<div className="flex items-center justify-between mt-4">
											<div className="flex items-center gap-3 border border-gold/20 rounded-lg">
												<button
													onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
													className="p-2 hover:bg-gold/10 transition-colors"
												>
													<Minus className="w-4 h-4" />
												</button>
												<span className="px-4 py-2 font-medium min-w-[3rem] text-center">
													{item.quantity}
												</span>
												<button
													onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
													className="p-2 hover:bg-gold/10 transition-colors"
												>
													<Plus className="w-4 h-4" />
												</button>
											</div>
											<div className="text-right">
												<p className="text-xl font-bold text-gold">
													${((item.priceCents * item.quantity) / 100).toFixed(2)}
												</p>
												<p className="text-sm text-charcoal/60">
													${(item.priceCents / 100).toFixed(2)} each
												</p>
											</div>
										</div>
									</div>
									<button
										onClick={() => removeItem(item.productId, item.size)}
										className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors self-start"
										aria-label="Remove item"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								</div>
							))}
						</div>

						{/* Order Summary */}
						<aside className="card h-fit sticky top-4">
							<h2 className="h2 text-2xl mb-6">Order Summary</h2>
							<div className="space-y-4 mb-6">
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
								{subtotal < 10000 && (
									<p className="text-xs text-charcoal/60">
										Add ${((10000 - subtotal) / 100).toFixed(2)} more for free shipping
									</p>
								)}
							</div>
							<div className="border-t border-gold/20 pt-4 mb-6">
								<div className="flex items-center justify-between">
									<span className="font-semibold text-lg">Total</span>
									<span className="text-2xl font-bold text-gold">
										${(total / 100).toFixed(2)}
									</span>
								</div>
							</div>
							<Link
								href="/checkout"
								className="btn-primary w-full flex items-center justify-center gap-2"
							>
								Proceed to Checkout
								<ArrowRight className="w-4 h-4" />
							</Link>
							<Link
								href="/products"
								className="block text-center text-sm text-charcoal/60 hover:text-gold mt-4"
							>
								Continue Shopping
							</Link>
						</aside>
					</div>
				)}
			</div>
		</div>
	);
}
