import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
	return [
		{ url: `${base}/`, changeFrequency: "weekly", priority: 1 },
		{ url: `${base}/products`, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${base}/cart`, changeFrequency: "weekly", priority: 0.5 },
	];
}


