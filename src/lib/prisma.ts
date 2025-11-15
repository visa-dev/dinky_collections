import { PrismaClient } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";

// Ensure a single PrismaClient instance in dev
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Use Prisma Accelerate in production if available, otherwise use direct connection
const prismaClientOptions: Prisma.PrismaClientOptions = {
	log: process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const),
};

// Use Prisma Accelerate URL if available (for serverless environments like Vercel)
// Prisma Accelerate uses HTTP connections via the Accelerate proxy
// When using Accelerate, Prisma Client still needs to be initialized but queries go through HTTP
if (process.env.PRISMA_DATABASE_URL) {
	// Prisma Accelerate connection string (starts with prisma+postgres://)
	// This uses HTTP connections and doesn't require the binary query engine
	prismaClientOptions.datasources = {
		db: {
			url: process.env.PRISMA_DATABASE_URL,
		},
	};
} else if (process.env.VERCEL) {
	// On Vercel without Accelerate, we need the binary engine
	// The binary should be generated during build with binaryTargets = ["rhel-openssl-3.0.x"]
	console.warn("⚠️  PRISMA_DATABASE_URL not set on Vercel. Using direct connection.");
	console.warn("   Ensure binaryTargets include 'rhel-openssl-3.0.x' in prisma/schema.prisma");
}

export const prisma: PrismaClient =
	globalForPrisma.prisma ??
	new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
