import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const product = await prisma.product.findUnique({
			where: { id },
			include: { images: { orderBy: { index: "asc" } }, category: true },
		});
		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}
		return NextResponse.json(product);
	} catch (e) {
		return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
	}
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || (session.user as any)?.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const { id } = await params;
		const json = await req.json();
		const data = productSchema.parse(json);
		const { images, ...rest } = data;
		// Get existing images to delete from blob
		const existingProduct = await prisma.product.findUnique({
			where: { id },
			include: { images: true },
		});

		// Delete old images from blob
		if (existingProduct) {
			const { deleteFromBlob } = await import("@/lib/blob");
			for (const img of existingProduct.images) {
				if (img.blobId) {
					try {
						await deleteFromBlob(img.blobId);
					} catch (error) {
						console.error("Failed to delete blob:", error);
					}
				}
			}
		}

		const updated = await prisma.product.update({
			where: { id },
			data: {
				...rest,
				images: {
					deleteMany: {},
					create: images.map((img: any) => ({
						url: img.url,
						blobId: img.blobId,
						index: img.index ?? 0,
					})),
				},
			},
			include: { images: true },
		});
		return NextResponse.json(updated);
	} catch (e) {
		return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
	}
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || (session.user as any)?.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const { id } = await params;
		
		// Get product images before deletion
		const product = await prisma.product.findUnique({
			where: { id },
			include: { images: true },
		});

		// Delete images from blob
		if (product) {
			const { deleteFromBlob } = await import("@/lib/blob");
			for (const img of product.images) {
				if (img.blobId) {
					try {
						await deleteFromBlob(img.blobId);
					} catch (error) {
						console.error("Failed to delete blob:", error);
					}
				}
			}
		}

		await prisma.product.delete({ where: { id } });
		return NextResponse.json({ success: true });
	} catch (e) {
		return NextResponse.json({ error: "Failed to delete product" }, { status: 400 });
	}
}

