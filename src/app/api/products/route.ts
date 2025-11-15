import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const category = searchParams.get("category");
	const size = searchParams.get("size");
	const sort = searchParams.get("sort");
	const search = searchParams.get("search");
	const where: any = {};
	if (category) where.category = { slug: { equals: category } };
	if (size) where.sizes = { has: size };
	if (search) {
		where.OR = [
			{ name: { contains: search, mode: "insensitive" as const } },
			{ description: { contains: search, mode: "insensitive" as const } },
		];
	}
	const maxPrice = searchParams.get("maxPrice");
	if (maxPrice) {
		const maxPriceCents = Math.round(parseFloat(maxPrice) * 100);
		if (!isNaN(maxPriceCents)) {
			where.priceCents = { lte: maxPriceCents };
		}
	}
	const orderBy = sort === "price-asc" ? { priceCents: "asc" as const } : sort === "price-desc" ? { priceCents: "desc" as const } : { createdAt: "desc" as const };
	const products = await prisma.product.findMany({ where, orderBy, include: { images: true, category: true } });
	return NextResponse.json(products);
}

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || (session.user as any)?.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const json = await req.json();
		const data = productSchema.parse(json);
		const { images, ...rest } = data;
		const created = await prisma.product.create({
			data: {
				...rest,
				images: { create: images.map((img) => ({ url: img.url, blobId: img.blobId, index: img.index ?? 0 })) },
			},
			include: { images: true },
		});
		return NextResponse.json(created, { status: 201 });
	} catch (e) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}
}


