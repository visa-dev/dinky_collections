import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validators";

export async function GET() {
	const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
	return NextResponse.json(categories);
}

export async function POST(req: Request) {
	try {
		const json = await req.json();
		const data = categorySchema.parse(json);
		const created = await prisma.category.create({ data });
		return NextResponse.json(created, { status: 201 });
	} catch (e) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}
}


