import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// @ts-ignore - bcrypt types
import bcrypt from "bcrypt";
import { z } from "zod";

const signupSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const data = signupSchema.parse(body);

		// Check if user already exists
		const existing = await prisma.user.findFirst({
			where: { email: data.email },
		});

		if (existing) {
			return NextResponse.json(
				{ error: "User with this email already exists" },
				{ status: 400 }
			);
		}

		// Hash password
		const passwordHash = await bcrypt.hash(data.password, 10);

		// Create user (default role is USER)
		const user = await prisma.user.create({
			data: {
				email: data.email,
				name: data.name || null,
				passwordHash,
				role: "USER", // Regular users, not admin
			},
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
			},
		});

		return NextResponse.json(
			{ message: "User created successfully", user },
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: error.issues[0]?.message || "Validation error" },
				{ status: 400 }
			);
		}
		console.error("Signup error:", error);
		return NextResponse.json(
			{ error: "Failed to create user" },
			{ status: 500 }
		);
	}
}

