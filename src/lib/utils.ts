/**
 * Format price in Sri Lankan Rupees (LKR)
 * @param priceCents - Price in cents
 * @returns Formatted price string (e.g., "Rs. 2,999.00")
 */
export function formatPrice(priceCents: number): string {
	const price = priceCents / 100;
	return `Rs. ${price.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format price without currency symbol (for input fields)
 * @param priceCents - Price in cents
 * @returns Formatted price number
 */
export function formatPriceNumber(priceCents: number): number {
	return priceCents / 100;
}

/**
 * Convert price from LKR to cents
 * @param price - Price in LKR
 * @returns Price in cents
 */
export function priceToCents(price: number): number {
	return Math.round(price * 100);
}

