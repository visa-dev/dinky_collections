import { z } from "zod";

export const categorySchema = z.object({
	name: z.string().min(2).max(50),
	slug: z.string().min(2).max(60),
	description: z.string().max(300).optional().or(z.literal("")),
});

export const productSchema = z.object({
	name: z.string().min(2).max(100),
	slug: z.string().min(2).max(120),
	description: z.string().min(10).max(2000),
	priceCents: z.number().int().min(0),
	sizes: z.array(z.string()).min(1),
	categoryId: z.string(),
	images: z.array(z.object({ url: z.string().url(), blobId: z.string().optional(), index: z.number().int().min(0).default(0) })).min(1),
	inStock: z.boolean().default(true),
});

