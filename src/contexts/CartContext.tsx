"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
	productId: string;
	slug: string;
	name: string;
	priceCents: number;
	size: string;
	imageUrl: string;
	quantity: number;
}

interface CartContextType {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity">) => void;
	removeItem: (productId: string, size: string) => void;
	updateQuantity: (productId: string, size: string, quantity: number) => void;
	clearCart: () => void;
	getTotal: () => number;
	getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const stored = localStorage.getItem("cart");
		if (stored) {
			try {
				setItems(JSON.parse(stored));
			} catch {
				setItems([]);
			}
		}
	}, []);

	useEffect(() => {
		if (mounted) {
			localStorage.setItem("cart", JSON.stringify(items));
		}
	}, [items, mounted]);

	const addItem = (item: Omit<CartItem, "quantity">) => {
		setItems((prev) => {
			const existing = prev.find((i) => i.productId === item.productId && i.size === item.size);
			if (existing) {
				return prev.map((i) =>
					i.productId === item.productId && i.size === item.size
						? { ...i, quantity: i.quantity + 1 }
						: i
				);
			}
			return [...prev, { ...item, quantity: 1 }];
		});
	};

	const removeItem = (productId: string, size: string) => {
		setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
	};

	const updateQuantity = (productId: string, size: string, quantity: number) => {
		if (quantity <= 0) {
			removeItem(productId, size);
			return;
		}
		setItems((prev) =>
			prev.map((i) =>
				i.productId === productId && i.size === size ? { ...i, quantity } : i
			)
		);
	};

	const clearCart = () => {
		setItems([]);
	};

	const getTotal = () => {
		return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
	};

	const getItemCount = () => {
		return items.reduce((sum, item) => sum + item.quantity, 0);
	};

	return (
		<CartContext.Provider
			value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount }}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within CartProvider");
	}
	return context;
}

