import { PrismaClient } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";

// Ensure a single PrismaClient instance in dev
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Use Prisma Accelerate in production if available, otherwise use direct connection
const prismaClientOptions: Prisma.PrismaClientOptions = {
	log: process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const),
};

// Use Prisma Accelerate URL if available (for serverless environments like Vercel)
if (process.env.PRISMA_DATABASE_URL) {
	prismaClientOptions.datasources = {
		db: {
			url: process.env.PRISMA_DATABASE_URL,
		},
	};
}

export const prisma: PrismaClient =
	globalForPrisma.prisma ??
	new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
